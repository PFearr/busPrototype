import { io } from "socket.io-client";

export default ()=>{
    const socket = io("", {transports: ['websocket']});
    socket.on("connect", ()=>{
        console.log("Connected to socket")
    })
    socket.on("disconnect", ()=>{
        console.log("Disconnected from socket")
    })
    return socket
}