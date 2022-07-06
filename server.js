const express = require("express"); //aacess
const socket = require("socket.io");

const app = express(); // initializing sever

app.use(express.static("public"));

let port = process.env.PORT || 3000; 
let server = app.listen(port, ()=>{
    console.log("listening to port 3000");
})


let io = socket(server);

//starts socket connection
io.on("connection", (socket)=>{
    console.log("started socket connection");
    //recieved data from one socket
    socket.on("beginPath", (data)=>{
        // transfer data to all connected sockets with server
        io.sockets.emit("beginPath", data);
    })
    socket.on("drawStroke", (data)=>{
        // transfer data to all connected sockets with server
        io.sockets.emit("drawStroke", data);
    })
    socket.on("undoRedoCanvas", (data)=>{
        // transfer data to all connected sockets with server
        io.sockets.emit("undoRedoCanvas", data);
    })

})

