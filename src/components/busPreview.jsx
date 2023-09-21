import { Link } from 'react-router-dom';
import socketFunction from './socket';
import { useEffect, useState } from 'react';
import BusSvG from './busSvg';
export default function BusPreview() {
    const [socket, setSocket] = useState(null);
    const [busses, setBusses] = useState([]);
    const [busSize, setBusSize] = useState({
        width: "50%",
        height: "5%"
    });
    useEffect(() => {
        const socket = socketFunction();
        setSocket(socket);
        socket.emit('getBusses');
        socket.on('busses', data => {
            setBusses(data);
        });
        return () => {
            socket.disconnect();
        }
    }, [])
    return (
        <>
            <main>
                <div id="home" className="active">
                    <div className="bus-list" style={{
                        width: "50%",
                        height: "100%",
                        marginTop: "10%"
                    }}>
                        <h1>Left</h1>
                        <div style={{
                            width: "50%",
                            height: "100%",
                        }}>{busses?.left?.map((bus, index) => {
                            return (
                                <BusSvG index={
                                    index
                                }
                                width={busSize.width} height={busSize.height} bus={
                                    bus
                                } isLast={
                                    index == busses.left.length - 1
                                } />
                            )
                        })}</div>
                    </div>
                    <div className="bus-list" style={{
                        width: "50%",
                        height: "100%",
                        marginTop: "10%"
                    }}>
                        <h1>Right</h1>
                        <div style={{
                            width: "50%",
                            height: "100%"
                        }}>{busses?.right?.map((bus, index) => {
                            return (
                                <BusSvG index={
                                    index
                                }
                                width={busSize.width} height={busSize.height} bus={bus} isLast={
                                    index == busses.left.length - 1
                                } />
                            )
                        })}</div>
                    </div>
                </div>
            </main>
            <div id="backdrop" />
        </>

    )
}