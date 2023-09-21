import fs from "fs"
export default (io) => {
    io.on("connection", (socket) => {
        console.log("Connection established")
        socket.on("getBusses",()=>{
            socket.emit("busses",JSON.parse(fs.readFileSync("./data/busses.json","utf8")))
        })
        socket.on("towns",()=>{
            socket.emit("towns",JSON.parse(fs.readFileSync("./data/towns.json","utf8")))
        })
        socket.on("setBusses",(busses)=>{
            fs.writeFileSync("./data/busses.json",JSON.stringify(busses))
            io.emit("busses",busses)
            socket.emit("success","Busses updated")
        })
    })
}