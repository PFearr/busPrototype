import { Link } from 'react-router-dom';
import socketFunction from './socket';
import { useEffect, useState, useRef } from 'react';
import BusSvG from './busSvgAdmin';
export default function BusPreview() {
    const [socket, setSocket] = useState(null);
    const [busses, setBusses] = useState([]);
    const [busSize, setBusSize] = useState({
        width: "50%",
        height: "5%"
    });
    const [towns, setTowns] = useState([]);


    const [loaded, setLoading] = useState(false);
    const [loadingBusQuote, setLoadingBusQuote] = useState("Loading up bus locations");
    const loadingRef = useRef(null);
    useEffect(() => {
        if (loaded) {
            loadingRef.current.style.opacity = 0;
            setTimeout(() => {
                loadingRef.current.style.display = "none";
            }, 500);
        }
    }, [loaded])

    useEffect(() => {
        const socket = socketFunction();
        setSocket(socket);
        socket.emit('getBusses');
        socket.emit("towns")
        socket.on("success", message => {
            alert(message);
        })
        socket.on('busses', data => {
            setBusses(data);
            setTimeout(() => {
                setLoading(true)
            }, 500);
        });
        socket.on("towns", data => {
            setTowns(data);
        })
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
                loaded == false ? null : <main>
                    <div id="home" className="active">
                        <button style={{
                            width: "auto",
                            height: "auto",
                            backgroundColor: "green",
                            marginTop: "10%",
                            // top center
                            position: "absolute",
                            right: "0",
                            top: "0%",
                            transform: "translate(0%, 0%)",
                            borderRadius: "10px",
                            color: "white",
                            fontSize: "1.5em",
                        }} onClick={
                            () => {
                                // check if duplicate busses
                                let checked = [];
                                let duplicate = false;
                                busses.left.forEach((bus, index) => {
                                    if (bus != "" && !duplicate) {
                                        for (let i = 0; i < checked.length; i++) {
                                            if (checked[i].bus == bus) {
                                                alert(`Duplicate ${checked[i].bus} busses at ${checked[i].pos} ${checked[i].index + 1} and Left ${index + 1}`)
                                                duplicate = true;
                                                return;
                                            }
                                        }
                                        checked.push({ bus: bus, index: index, pos: "Left" });
                                    }
                                });
                                busses.right.forEach((bus, index) => {
                                    if (bus != "" && !duplicate) {
                                        for (let i = 0; i < checked.length; i++) {
                                            if (checked[i].bus == bus) {
                                                alert(`Duplicate ${checked[i].bus} busses at ${checked[i].pos} ${checked[i].index + 1} and Right ${index + 1}`)
                                                duplicate = true;
                                                return;
                                            }
                                        }
                                        checked.push({ bus: bus, index: index, pos: "Right" });
                                    }
                                });
                                if (!duplicate) {
                                    socket.emit("setBusses", busses)
                                }
                            }
                        }>
                            Set Busses
                        </button>
                        <button style={{
                            width: "auto",
                            height: "auto",
                            backgroundColor: "red",
                            marginTop: "10%",
                            // top center
                            position: "absolute",
                            right: "0",
                            top: "10%",
                            transform: "translate(0%, 0%)",
                            borderRadius: "10px",
                            color: "white",
                            fontSize: "1.5em",
                        }} onClick={
                            () => {
                                let confirm = window.confirm("Are you sure you want to clear all busses? This action cannot be undone.");
                                if (!confirm) return;
                                confirm = window.confirm("Are you really sure? This action cannot be undone.");
                                if (!confirm) return;
                                setBusses({ left: ["", "", "", "", "", "", "", "", "", "", ""], right: ["", "", "", "", "", "", "", "", "", "", ""] });
                                socket.emit("setBusses", { left: ["", "", "", "", "", "", "", "", "", "", ""], right: ["", "", "", "", "", "", "", "", "", "", ""] });
                                window.location.reload();
                            }
                        }>
                            Clear
                        </button>
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
                                        busses={
                                            busses
                                        }
                                        setBus={
                                            (bus, index) => {
                                                let newBusses = busses;
                                                newBusses.left[index] = bus;
                                                setBusses(newBusses);
                                            }
                                        }
                                        towns={
                                            towns
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
                                        busses={
                                            busses
                                        }
                                        towns={
                                            towns
                                        }
                                        setBus={
                                            (bus, index) => {
                                                let newBusses = busses;
                                                newBusses.right[index] = bus;
                                                setBusses(newBusses);
                                            }
                                        }
                                        width={busSize.width} height={busSize.height} bus={bus} isLast={
                                            index == busses.left.length - 1
                                        } />
                                )
                            })}</div>
                        </div>

                    </div>

                </main>
            }
        </>

    )
}