import { Link } from 'react-router-dom';
import socketFunction from './socket';
import { useEffect, useState, useRef } from 'react';
import BusSvG from './busSvg';
export default function BusPreview() {
    const [socket, setSocket] = useState(null);
    const [busses, setBusses] = useState([]);
    const [busSize, setBusSize] = useState({
        width: "50%",
        height: "5%"
    });

    const [loaded,setLoading] = useState(false);
    const [loadingBusQuote, setLoadingBusQuote] = useState("Loading up bus locations");
    const loadingRef = useRef(null);
    useEffect(()=>{
        if (loaded){
            loadingRef.current.style.opacity = 0;
            setTimeout(() => {
                loadingRef.current.style.display = "none";
            }, 500);
        }
    },[loaded])
    useEffect(() => {
        const socket = socketFunction();
        setSocket(socket);
        socket.emit('getBusses');
        socket.on('busses', data => {
            setBusses(data);
            setTimeout(() => {
                setLoading(true)
            }, 1000);
        });
        return () => {
            socket.disconnect();
        }
    }, [])
    return (
        <>
        <div className="loading" ref={
            loadingRef
        } style={{
            position: "fixed",
            top: 0,
            left: 0,
            backgroundColor: "rgba(0,0,0,0)",
            zIndex: 1000,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column"
        }}>
            <h1>{loadingBusQuote}</h1>
            {/* load circles */}
            <div className="loader"></div>
        </div> 
        {
        loaded == false ? null : <>
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
                        <h1 >Right</h1>
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
        }
        </>

    )
}