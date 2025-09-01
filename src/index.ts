import express from "express";
import cors from "cors";
import http from "http";
import { Server, Socket } from "socket.io";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



const server = http.createServer(app);


const io = new Server(server, {
    cors:{
        origin: "*",
    }
})


let onlineUsers:any = {

}


io.on("connection", (socket) =>{
    console.log("new client connected")


    socket.on("join", (userId) =>{
        onlineUsers[userId] = socket.id;
        console.log("one user joined")
        console.log("online users are", onlineUsers)
    })


    socket.on("send_message", ({senderId , receiverId, message})=>{
        const receiverSocket = onlineUsers[receiverId];
        if(receiverSocket){
            io.to(receiverSocket).emit("receive_message", {senderId, message});
        }
    })

    socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
      }
    }
    console.log('Online users:', onlineUsers);
  });
})

server.listen(3000, () => {
    console.log("Server is running on port 3000");
});


