import { io } from "socket.io-client";
const URL = import.meta.env.VITE_APIURL

export default ()=>{
    console.log("URL:",URL)
    const socket = io(URL, {transports: ['websocket']});
    socket.on("connect", ()=>{
        console.log("Connected to socket")
    })
    socket.on("disconnect", ()=>{
        console.log("Disconnected from socket")
    })
    return socket
}