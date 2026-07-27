pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

/* ==========================================================
   ELEMENTS
========================================================== */

const viewer = document.getElementById("viewer");
const canvas = document.getElementById("pdfCanvas");
const ctx = canvas.getContext("2d", { alpha: false });

const container = document.getElementById("canvasContainer");

const zoomLabel = document.getElementById("zoomLevel");
const cursorLabel = document.getElementById("cursorPosition");

const minimapViewport = document.getElementById("miniViewport");

/* ==========================================================
   CAMERA
========================================================== */

const camera = {

    x:0,
    y:0,

    scale:1,
    targetScale:1,

    minScale:.1,
    maxScale:10,

    velocityX:0,
    velocityY:0,

    dragging:false,

    lastMouseX:0,
    lastMouseY:0

};

/* ==========================================================
   PDF
========================================================== */

let pdf=null;
let page=null;

let renderScale=3;

/* ==========================================================
   LOAD PDF
========================================================== */

async function loadPDF(path){

    pdf=await pdfjsLib.getDocument(path).promise;

    page=await pdf.getPage(1);

    await rerenderPDF();

    fitPage();

}

/* loadPDF removed — loadSheet(0) handles initial load */

/* ==========================================================
   RENDER PDF
========================================================== */

const offCanvas = document.createElement("canvas");
const offCtx = offCanvas.getContext("2d", { alpha: false });

let canvasReady = false;

async function rerenderPDF(){

    const viewport=page.getViewport({

        scale:renderScale*window.devicePixelRatio

    });

    offCanvas.width=viewport.width;
    offCanvas.height=viewport.height;

    await page.render({

        canvasContext:offCtx,
        viewport

    }).promise;

    canvas.width=viewport.width;
    canvas.height=viewport.height;

    canvas.style.width=
        viewport.width/window.devicePixelRatio+"px";

    canvas.style.height=
        viewport.height/window.devicePixelRatio+"px";

    ctx.drawImage(offCanvas,0,0);

    if(!canvasReady){

        canvasReady=true;

        container.style.opacity="1";

    }

}

/* ==========================================================
   FIT PAGE
========================================================== */

function fitPage(){

    const vw=viewer.clientWidth;
    const vh=viewer.clientHeight;

    const w=canvas.clientWidth;
    const h=canvas.clientHeight;

    camera.scale=Math.min(

        vw/w,

        vh/h

    )*.92;

    camera.targetScale=camera.scale;

    camera.x=0;
    camera.y=0;

}

/* ==========================================================
   UPDATE
========================================================== */

function update(){

    camera.scale+=
        (camera.targetScale-camera.scale)*0.18;

    container.style.transform=

`translate(calc(-50% + ${camera.x}px),
calc(-50% + ${camera.y}px))
scale(${camera.scale})`;

    zoomLabel.textContent=

Math.round(camera.scale*100)+"%";

    updateMiniMap();

    requestAnimationFrame(update);

}

requestAnimationFrame(update);

/* ==========================================================
   MINIMAP
========================================================== */

const miniCanvas = document.getElementById("miniCanvas");
const miniCtx = miniCanvas.getContext("2d");
const minimapEl = document.getElementById("minimap");

let miniPageW = 1;
let miniPageH = 1;

async function renderMiniMap(){

    if(!page) return;

    const vp = page.getViewport({scale:1});

    miniPageW = vp.width;
    miniPageH = vp.height;

    const fitScale = Math.min(
        170 / miniPageW,
        120 / miniPageH
    );

    const mvp = page.getViewport({scale:fitScale});

    miniCanvas.width = mvp.width;
    miniCanvas.height = mvp.height;

    await page.render({
        canvasContext:miniCtx,
        viewport:mvp
    }).promise;

}

function updateMiniMap(){

    if(!page || miniPageW<=1) return;

    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;

    const visibleW = viewer.clientWidth / camera.scale;
    const visibleH = viewer.clientHeight / camera.scale;

    const offsetX = -camera.x / camera.scale;
    const offsetY = -camera.y / camera.scale;

    const vpW = (visibleW / cw) * 100;
    const vpH = (visibleH / ch) * 100;

    const vpLeft = 50 + (offsetX / cw) * 100 - vpW / 2;
    const vpTop = 50 + (offsetY / ch) * 100 - vpH / 2;

    minimapViewport.style.width =
        Math.max(5, Math.min(100, vpW)) + "%";

    minimapViewport.style.height =
        Math.max(5, Math.min(100, vpH)) + "%";

    minimapViewport.style.left =
        Math.max(-20, Math.min(100, vpLeft)) + "%";

    minimapViewport.style.top =
        Math.max(-20, Math.min(100, vpTop)) + "%";

}

/* ==========================================================
   MOUSE PAN
========================================================== */

viewer.addEventListener("mousedown",e=>{

    camera.dragging=true;

    camera.lastMouseX=e.clientX;
    camera.lastMouseY=e.clientY;

});

window.addEventListener("mouseup",()=>{

    camera.dragging=false;

});

window.addEventListener("mousemove",e=>{

    if(camera.dragging){

        camera.x+=
            e.clientX-camera.lastMouseX;

        camera.y+=
            e.clientY-camera.lastMouseY;

        camera.lastMouseX=e.clientX;
        camera.lastMouseY=e.clientY;

    }

    updateCursor(e);

});

/* ==========================================================
   CURSOR
========================================================== */

function updateCursor(e){

    const rect=viewer.getBoundingClientRect();

    const px=
    ((e.clientX-rect.left)-viewer.clientWidth/2-camera.x)
        /camera.scale;

    const py=
    ((e.clientY-rect.top)-viewer.clientHeight/2-camera.y)
        /camera.scale;

    cursorLabel.textContent=

Math.round(px)+" , "+Math.round(py);

}

/* ==========================================================
    SMOOTH CAMERA CONTROLS
========================================================== */

viewer.addEventListener(
    "wheel",
    (e) => {

        e.preventDefault();

        const rect = viewer.getBoundingClientRect();

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldX =
            (mouseX - viewer.clientWidth / 2 - camera.x) /
            camera.targetScale;

        const worldY =
            (mouseY - viewer.clientHeight / 2 - camera.y) /
            camera.targetScale;

        const zoomFactor =
            e.deltaY < 0 ? 1.12 : 1 / 1.12;

        const oldScale = camera.targetScale;

        camera.targetScale *= zoomFactor;

        camera.targetScale = Math.max(
            camera.minScale,
            Math.min(camera.maxScale, camera.targetScale)
        );

        const newScale = camera.targetScale;

        camera.x =
            mouseX -
            viewer.clientWidth / 2 -
            worldX * newScale;

        camera.y =
            mouseY -
            viewer.clientHeight / 2 -
            worldY * newScale;

    },
    { passive:false }
);

/* ==========================================================
    INERTIA
========================================================== */

window.addEventListener("mousemove",(e)=>{

    if(!camera.dragging) return;

    camera.velocityX =
        e.movementX;

    camera.velocityY =
        e.movementY;

});

function updateInertia(){

    if(!camera.dragging){

        camera.x += camera.velocityX;
        camera.y += camera.velocityY;

        camera.velocityX *= .90;
        camera.velocityY *= .90;

        if(Math.abs(camera.velocityX)<.05)
            camera.velocityX=0;

        if(Math.abs(camera.velocityY)<.05)
            camera.velocityY=0;

    }

    requestAnimationFrame(updateInertia);

}

requestAnimationFrame(updateInertia);

/* ==========================================================
    DOUBLE CLICK
========================================================== */

viewer.addEventListener("dblclick",(e)=>{

    const rect =
        viewer.getBoundingClientRect();

    const mx =
        e.clientX-rect.left;

    const my =
        e.clientY-rect.top;

    const wx =
        (mx-viewer.clientWidth/2-camera.x)
        /camera.scale;

    const wy =
        (my-viewer.clientHeight/2-camera.y)
        /camera.scale;

    camera.targetScale*=2;

    camera.targetScale=Math.min(
        camera.targetScale,
        camera.maxScale
    );

    camera.x =
        mx-viewer.clientWidth/2-
        wx*camera.targetScale;

    camera.y =
        my-viewer.clientHeight/2-
        wy*camera.targetScale;

});

/* ==========================================================
    KEYBOARD
========================================================== */

window.addEventListener("keydown",(e)=>{

    switch(e.key){

        case "0":
            fitPage();
            break;

        case "+":
        case "=":
            camera.targetScale*=1.2;
            break;

        case "-":
            camera.targetScale/=1.2;
            break;

        case "ArrowLeft":
            camera.x+=40;
            break;

        case "ArrowRight":
            camera.x-=40;
            break;

        case "ArrowUp":
            camera.y+=40;
            break;

        case "ArrowDown":
            camera.y-=40;
            break;

    }

});

/* ==========================================================
    TOOLBAR
========================================================== */

document.getElementById("zoomIn").onclick=()=>{

    camera.targetScale*=1.2;

};

document.getElementById("zoomOut").onclick=()=>{

    camera.targetScale/=1.2;

};

document.getElementById("resetView").onclick=()=>{

    fitPage();

};

document.getElementById("fitButton").onclick=()=>{

    fitPage();

};

/* ==========================================================
    SIDEBAR TOGGLE
========================================================== */

document.getElementById("toggleSidebar").onclick=()=>{

    const sb=document.getElementById("sidebar");

    if(window.innerWidth<=900){

        sb.classList.toggle("open");

    }else{

        sb.classList.toggle("collapsed");

    }

};

/* ==========================================================
    FULLSCREEN
========================================================== */

document
.getElementById("fullscreenButton")
.onclick=()=>{

    if(!document.fullscreenElement){

        document.documentElement.requestFullscreen();

    }else{

        document.exitFullscreen();

    }

};

/* ==========================================================
    RESIZE
========================================================== */

window.addEventListener("resize",()=>{

    fitPage();

});

/* ==========================================================
   MULTI SHEET SUPPORT
========================================================== */

const sheets = [
{
    name:"Floor 1",
    file:"My DreamHouse Residential-Floor-Plan/Autodesk Viewer _firstfloor.pdf"
},
{
    name:"Floor 2",
    file:"My DreamHouse Residential-Floor-Plan/Autodesk Viewer _ SecondFloor.pdf"
}
];

const cache = new Map();

const sheetButtons =
    document.querySelectorAll(".sheet");

let currentSheet = 0;

/* ==========================================================
   LOAD SHEET
========================================================== */

async function loadSheet(index){

    currentSheet=index;

    document
        .querySelectorAll(".sheet")
        .forEach((b,i)=>{

            b.classList.toggle(
                "active",
                i===index
            );

        });

    document.querySelector("header h1").textContent =
        "Zyra's Dream House Floor (" + (index+1) + ")";

    document
        .querySelector("#statusbar span:nth-child(3)")
        .textContent = "Floor " + (index+1);

    if(cache.has(index)){

        pdf = cache.get(index).pdf;
        page = cache.get(index).page;

        await rerenderPDF();

        fitPage();

        await renderMiniMap();

        return;

    }

    const doc =
        await pdfjsLib
        .getDocument(sheets[index].file)
        .promise;

    const first =
        await doc.getPage(1);

    cache.set(index,{
        pdf:doc,
        page:first
    });

    pdf=doc;
    page=first;

    await rerenderPDF();

    fitPage();

    await renderMiniMap();

}

sheetButtons.forEach((button,index)=>{

    button.onclick=()=>{

        loadSheet(index);

    }

});

/* ==========================================================
   GENERATE THUMBNAILS
========================================================== */

async function buildThumbnails(){

    for(let i=0;i<sheets.length;i++){

        const doc =
            await pdfjsLib
            .getDocument(
                sheets[i].file
            )
            .promise;

        const page =
            await doc.getPage(1);

        const viewport =
            page.getViewport({
                scale:.18
            });

        const thumb =
            document.createElement("canvas");

        thumb.width=viewport.width;
        thumb.height=viewport.height;

        await page.render({

            canvasContext:
                thumb.getContext("2d"),

            viewport

        }).promise;

        const holder =
            sheetButtons[i]
            .querySelector(".sheet-thumb");

        holder.innerHTML="";

        holder.appendChild(thumb);

    }

}

buildThumbnails();

/* ==========================================================
   STATUS BAR
========================================================== */

function updateStatus(){

    zoomLabel.textContent=
        Math.round(camera.scale*100)+"%";

    document
        .querySelector("#statusbar span:nth-child(3)")
        .textContent=sheets[currentSheet].name;

}

setInterval(updateStatus,100);

/* ==========================================================
   KEYBOARD SHORTCUTS
========================================================== */

window.addEventListener("keydown",e=>{

    if(e.key==="1")
        loadSheet(0);

    if(e.key==="2")
        loadSheet(1);

});

/* ==========================================================
   PRELOAD PDFs
========================================================== */

(async()=>{

    for(let i=0;i<sheets.length;i++){

        if(cache.has(i))
            continue;

        const doc=
            await pdfjsLib
            .getDocument(sheets[i].file)
            .promise;

        const page=
            await doc.getPage(1);

        cache.set(i,{
            pdf:doc,
            page
        });

    }

})();

/* ==========================================================
   STARTUP
========================================================== */

loadSheet(0);
