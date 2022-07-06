let canvas=document.querySelector("canvas")
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
let mousedown=false;//not in down by default

let pencilColors=document.querySelectorAll(".pencil-color");
let pencilWidthElem=document.querySelector(".pencil-width");
let eraserWidthElem=document.querySelector(".eraser-width");
let download=document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

/*let eraser=document.querySelector(".eraser"); ALREADY AQUIRED IN TOOLS.JS*/ 

let pencilColor="red";
let eraserColor="white";
let pencilWidth=pencilWidthElem.value;
let eraserWidth=eraserWidthElem.value;

let undoRedoTracker = []; //Data
let track = 0; // Represent which action from tracker array


// API
let tool = canvas.getContext("2d");

//default values
tool.strokeStyle=pencilColor;
tool.lineWidth=pencilWidth;


//mousedown - start new graph
//mousemove - path color fill

canvas.addEventListener("mousedown",(e)=>{
    mousedown=true;
    let data = {
        x: e.clientX,
        y: e.clientY,
    }

    socket.emit("beginPath", data);
})

canvas.addEventListener("mousemove",(e)=>{
    if(mousedown){
        let data = {
            x: e.clientX,
            y: e.clientY,
            color: eraserFlag ? eraserColor : pencilColor,
            width: eraserFlag ? eraserWidth : pencilWidth
        }

        socket.emit("drawStroke", data);
    }
    
})

canvas.addEventListener("mouseup",(e)=>{
    mousedown=false;
    //keeping track of graphics

    //console.log("saving"); - For undo/redo debugging for colored strokes
    let url = canvas.toDataURL();
    //console.log(undoRedoTracker.length);
    undoRedoTracker.push(url);
    //console.log(undoRedoTracker.length);
    track = undoRedoTracker.length-1;
    //console.log(track);
    //console.log("saved");
    
})

undo.addEventListener("click", (e) => {
    if (track > 0) track--;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("undoRedoCanvas", data);
})

redo.addEventListener("click", (e) => {
    if (track < undoRedoTracker.length-1) track++;
    // track action
    let data = {
        trackValue: track,
        undoRedoTracker
    }
    socket.emit("undoRedoCanvas", data);
})

function undoRedoCanvas(trackObj) {
    track = trackObj.trackValue;
    undoRedoTracker = trackObj.undoRedoTracker;

    console.log("new Image");
    let url = undoRedoTracker[track];
    let img = new Image(); // new image reference element
    img.src = url;
    img.onload = (e) => {
        tool.clearRect(0, 0, canvas.width, canvas.height);// without this only eraser strokes will undergo redo/undo beacuse of white color
        // and it wont perform undo/redo for color strokes
        tool.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}


function beginPath(strokeObj){
    tool.beginPath();
    tool.moveTo(strokeObj.x,strokeObj.y);
}

function drawStroke(strokeObj){
    tool.strokeStyle=strokeObj.color;
    tool.lineWidth=strokeObj.width;
    tool.lineTo(strokeObj.x,strokeObj.y);
    tool.stroke();//color fill
}

pencilColors.forEach((colorElem)=>{
    colorElem.addEventListener("click",(e)=>{
        let color = colorElem.classList[0];
        pencilColor =  color ;
        tool.strokeStyle = pencilColor;
    })
})

pencilWidthElem.addEventListener("change", (e) => {
    pencilWidth = pencilWidthElem.value;
    tool.lineWidth = pencilWidth;
})

eraserWidthElem.addEventListener("change", (e) => {
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})

eraser.addEventListener("click",(e)=>{
    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth;
    }else{
        tool.strokeStyle=pencilColor;
        tool.lineWidth=pencilWidth;
    }
})

download.addEventListener("click",(e)=>{
    let url=canvas.toDataURL();
    let a=document.createElement("a");
    a.href=url;
    a.download="board.jpg";
    a.click();
})

socket.on("beginPath", (data) => {
    beginPath(data);
})

socket.on("drawStroke", (data) => {
    drawStroke(data);
})

socket.on("undoRedoCanvas", (data) => {
    undoRedoCanvas(data);
})
