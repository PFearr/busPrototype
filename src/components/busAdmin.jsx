import { Link } from 'react-router-dom';
import socketFunction from './socket';
import { useEffect, useState, useRef } from 'react';
import BusSvG from './busSvgAdmin';
import Popup from './popup';
import CacheClass from './cache';
export default function BusPreview() {
    const [authorized, setAuthorized] = useState(false);
    const cache = new CacheClass();
    useEffect(() => {
        fetch("/authorized", {
            method: "POST",
            credentials: "include"
        }).then((res) => {
            res.json().then((data) => {
                setAuthorized(data.authorized)
            })
        })
    }, [])
    const [socket, setSocket] = useState(null);
    const [busses, setBusses] = useState([]);
    const [busSize, setBusSize] = useState({
        width: "50%",
        height: "5%"
    });
    const [bussesnothereArray, setBussesnothereArray] = useState([]);
    const [newBussesForLeft, setBussesleft] = useState([]);

    const [towns, setTowns] = useState([]);


    const [loaded, setLoading] = useState(false);
    const [loadingBusQuote, setLoadingBusQuote] = useState("Loading up bus locations");
    const loadingRef = useRef(null);


    const [popupHidden, setPopuphidden] = useState(true);


    useEffect(()=>{
        if (cache.get("busses")){
            setBusses(cache.get("busses"))
            setLoading(false)
        }
        if (cache.get("bussesnothereArray")){
            setBussesnothereArray(cache.get("bussesnothereArray"))
        }
        if (cache.get("bussesleft")){
            setBussesleft(cache.get("bussesleft"))
        }
    },[])

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
            cache.set("busses", data)
            let newBussesForNotHere = [];
            let newBussesForLeft = [];
            data.notHere.forEach(bus => {
                newBussesForNotHere.push(bus.town)
            })
            data.leftSchool.forEach(bus => {
                newBussesForLeft.push(bus.town)
            })
            cache.set("bussesnothereArray", newBussesForNotHere)
            setBussesnothereArray(newBussesForNotHere);
            cache.set("bussesleft", newBussesForLeft)
            setBussesleft(newBussesForLeft);
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
            <Popup setHiddenn={
                setPopuphidden
            } socket={socket} hidden={
                popupHidden
            } title={
                "Extra Options"
            }
                onSave={
                    () => {
                        socket.emit("setBusses", busses)
                    }
                }

                children={
                    <div>
                        <p>Set Busses that left the school</p>
                        {
                            towns.map(town => {
                                return (
                                    <>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue=""
                                                defaultChecked={
                                                    newBussesForLeft.includes(town)
                                                }
                                                id={town + "leftschool"}
                                                name={town}
                                                onChange={
                                                    (e) => {
                                                        let newBusses = busses;
                                                        if (e.target.checked) {
                                                            newBusses.leftSchool.push({
                                                                town: e.target.name,
                                                                time: new Date().getTime()
                                                            })
                                                        } else {
                                                            for (let i = 0; i < newBusses.leftSchool.length; i++) {
                                                                if (newBusses.leftSchool[i].town == e.target.name) {
                                                                    newBusses.leftSchool.splice(i, 1);
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                        setBusses(newBusses);
                                                    }
                                                }
                                            />
                                            <label className="form-check-label" htmlFor={town + "leftschool"}>
                                                {town}
                                            </label>
                                        </div>
                                    </>

                                )
                            })
                        }<br />
                        <p>Set Busses haven't arrived to the school</p>
                        {
                            towns.map(town => {
                                return (
                                    <>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue=""
                                                defaultChecked={
                                                    bussesnothereArray.includes(town)
                                                }
                                                id={town + "nothere"}
                                                name={town}
                                                onChange={
                                                    (e) => {
                                                        let newBusses = busses;
                                                        if (e.target.checked) {
                                                            newBusses.notHere.push({
                                                                town: e.target.name,
                                                                time: new Date().getTime()
                                                            })
                                                        } else {
                                                            for (let i = 0; i < newBusses.notHere.length; i++) {
                                                                if (newBusses.notHere[i].town == e.target.name) {
                                                                    newBusses.notHere.splice(i, 1);
                                                                    break;
                                                                }
                                                            }
                                                        }
                                                        setBusses(newBusses);
                                                    }
                                                }
                                            />
                                            <label className="form-check-label" htmlFor={town + "nothere"}>
                                                {town}
                                            </label>
                                        </div>
                                    </>

                                )
                            })
                        }
                    </div>
                } />
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
                    {
                        authorized == false ?
                            <div style={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                flexDirection: "column"
                            }}>
                                <h1>You are not authorized to view this page</h1>
                                <Link to="/">Go back</Link>
                            </div>
                            : <main>
                                <div id="home" className="active">
                                    <button className='changemoblie' style={{
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
                                    }}

                                        onClick={
                                            () => {
                                                // check if duplicate busses
                                                let confirm = window.confirm("Are you sure you want to set the busses? This action cannot be undone.");
                                                if (!confirm) return;
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
                                                busses.middle.forEach((bus, index) => {
                                                    if (bus != "" && !duplicate) {
                                                        for (let i = 0; i < checked.length; i++) {
                                                            if (checked[i].bus == bus) {
                                                                alert(`Duplicate ${checked[i].bus} busses at ${checked[i].pos} ${checked[i].index + 1} and Middle ${index + 1}`)
                                                                duplicate = true;
                                                                return;
                                                            }
                                                        }
                                                        checked.push({ bus: bus, index: index, pos: "MIddle" });
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
                                                busses.other.forEach((bus, index) => {
                                                    if (bus != "" && !duplicate) {
                                                        for (let i = 0; i < checked.length; i++) {
                                                            if (checked[i].bus == bus) {
                                                                alert(`Duplicate ${checked[i].bus} busses at ${checked[i].pos} ${checked[i].index + 1} and Other ${index + 1}`)
                                                                duplicate = true;
                                                                return;
                                                            }
                                                        }
                                                        checked.push({ bus: bus, index: index, pos: "Other" });
                                                    }
                                                });
                                                if (!duplicate) {
                                                    socket.emit("setBusses", busses)
                                                }
                                            }
                                        }>
                                        Set Busses
                                    </button>
                                    <button className='changemoblie' style={{
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
                                            socket.emit("clear");
                                            window.location.reload();
                                        }
                                    }>
                                        Clear
                                    </button>
                                    <button className='changemoblie' style={{
                                        width: "auto",
                                        height: "auto",
                                        backgroundColor: "blue",
                                        marginTop: "10%",
                                        // top center
                                        position: "absolute",
                                        right: "0",
                                        top: "20%",
                                        transform: "translate(0%, 0%)",
                                        borderRadius: "10px",
                                        color: "white",
                                        fontSize: "1.5em",
                                    }} onClick={
                                        () => {
                                            setPopuphidden(false)
                                        }
                                    }>
                                        Extra Options
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
                                        <h1>Middle</h1>
                                        <div style={{
                                            width: "50%",
                                            height: "100%",
                                        }}>{busses?.middle?.map((bus, index) => {
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
                                    <div className="bus-list" style={{
                                        width: "50%",
                                        height: "100%",
                                        marginTop: "10%"
                                    }}>
                                        <h1>Other</h1>
                                        <div style={{
                                            width: "50%",
                                            height: "100%"
                                        }}>{busses?.other?.map((bus, index) => {
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
                                                            newBusses.other[index] = bus;
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
            }
        </>

    )
}