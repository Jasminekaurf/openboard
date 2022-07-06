let optionsContainer=document.querySelector(".options-container")
let optionsFlag=true;
let toolsContainer=document.querySelector(".tools-container");
let pencil = document.querySelector(".pencil");
let eraser = document.querySelector(".eraser");
let pencilToolContainer=document.querySelector(".pencil-tool-container");
let eraserToolContainer=document.querySelector(".eraser-tool-container");
let pencilFlag=false;
let eraserFlag=false;
let sticky = document.querySelector(".sticky");
let upload = document.querySelector(".upload");


optionsContainer.addEventListener("click", (e) => {
    // true -> tools show, false -> hide tools
    optionsFlag = !optionsFlag;

    if (optionsFlag) openTools();
    else closeTools();
})


function openTools() {
    let iconElem = optionsContainer.children[0];
    iconElem.classList.remove("fa-toolbox");
    iconElem.classList.add("fa-times");
    toolsContainer.style.display="flex";
}
function closeTools() {
    let iconElem = optionsContainer.children[0];
    iconElem.classList.remove("fa-times");
    iconElem.classList.add("fa-toolbox");
    toolsContainer.style.display="none";
    pencilToolContainer.style.display="none";
    eraserToolContainer.style.display="none";
}

pencil.addEventListener("click",(e)=>{
    //true= show tool, false=hide pencil tool
    pencilFlag=!pencilFlag;
    if(pencilFlag){
        pencilToolContainer.style.display="block";
        
    }else{
        pencilToolContainer.style.display="none";
    }
})

eraser.addEventListener("click",(e)=>{
    //true= show tool, false=hide eraser tool
    eraserFlag=!eraserFlag;
    if(eraserFlag){
        eraserToolContainer.style.display="flex";
    }else{
        eraserToolContainer.style.display="none";
    }
})

upload.addEventListener("click", (e) => {
    // Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e) => {
        let file = input.files[0];
        let url = URL.createObjectURL(file);

        let stickyTemplateHTML = `
        <div class="header-container">
            <div class="minimize"></div>
            <div class="remove"></div>
        </div>
        <div class="note-container">
            <img src="${url}"/>
        </div>
        `;
        createSticky(stickyTemplateHTML);
    })
})

sticky.addEventListener("click", (e) => {
    let stickyTemplateHTML = `
    <div class="header-container">
        <div class="minimize"></div>
        <div class="remove"></div>
    </div>
    <div class="note-container">
        <textarea spellcheck="false"></textarea>
    </div>
    `;

    createSticky(stickyTemplateHTML);
})

function createSticky(stickyTemplateHTML) {
    let stickyContainer = document.createElement("div");
    stickyContainer.setAttribute("class", "sticky-container");
    stickyContainer.innerHTML = stickyTemplateHTML;
    document.body.appendChild(stickyContainer);

    let minimize = stickyContainer.querySelector(".minimize");
    let remove = stickyContainer.querySelector(".remove");
    noteActions(minimize, remove, stickyContainer);

    stickyContainer.onmousedown = function (event) {
        dragAndDrop(stickyContainer, event);
    };

    stickyContainer.ondragstart = function () {
        return false;
    };
}

function noteActions(minimize, remove, stickyContainer) {
    remove.addEventListener("click", (e) => {
        stickyContainer.remove();
    })
    minimize.addEventListener("click", (e) => {
        let noteContainer = stickyContainer.querySelector(".note-container");
        let display = getComputedStyle(noteContainer).getPropertyValue("display");
        if (display === "none") noteContainer.style.display = "block";
        else noteContainer.style.display = "none";
    })
}

function dragAndDrop(element, event) {
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    element.style.position = 'absolute';
    element.style.zIndex = 1000;

    moveAt(event.pageX, event.pageY);

    // moves the element at (pageX, pageY) coordinates
    // taking initial shifts into account
    function moveAt(pageX, pageY) {
        element.style.left = pageX - shiftX + 'px';
        element.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
    }

    // move on mousemove
    document.addEventListener('mousemove', onMouseMove);

    // remove unneeded handlers
    element.onmouseup = function () {
        document.removeEventListener('mousemove', onMouseMove);
        element.onmouseup = null;
    };
}