import { Link } from 'react-router-dom';
import socketFunction from './socket';
import { useEffect, useState, useRef } from 'react';
import BusSvG from './busSvg';
import moment from 'moment';
import CacheClass from './cache';
export default function BusPreview() {
    const [socket, setSocket] = useState(null);
    const [busses, setBusses] = useState([]);
    const cache = new CacheClass();
    const [busSize, setBusSize] = useState({
        width: "50%",
        height: "5%"
    });

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
    useEffect(()=>{
        if (cache.get("busses")){
            setBusses(cache.get("busses"));
            setLoading(true);
        }
    },[])
    useEffect(() => {
        const socket = socketFunction();
        setSocket(socket);
        socket.emit('getBusses');
        socket.on('busses', data => {
            setBusses(data);
            cache.set("busses", data);
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
                            <div style={{
                                    paddingLeft: "25px",
                                    paddingBottom: "10px",
                                    height:"100%",
                                }}><h1>Busses that left campus</h1>
                                <div className="bus-list" style={{
                                    marginRight: "5px",
                                    width: "90%",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-evenly",
                                    alignItems: "center",
                                    flexWrap: "wrap"
                                }}>
                                    {
                                        busses?.leftSchool?.map((bus, index) => {
                                            return (
                                                <div key={index} className="bus" style={{
                                                    width: "100%",
                                                    height: "30%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    border: "1px solid black",
                                                    borderRadius: "5px",
                                                    margin: "5px"
                                                }}>
                                                    <div className="bus-name">{bus.town}</div>
                                                    <div className="bus-time">Left at {moment(bus.time).format("MM/DD/YYYY hh:mm a")}</div>
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        busses?.leftSchool?.length == 0 ? <div style={{
                                            width: "100%",
                                            height: "30%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            border: "1px solid black",
                                            borderRadius: "5px",
                                            margin: "5px"
                                        }}>
                                            <div className="bus-name">No busses have left campus</div>
                                        </div> : null
                                    }
                                </div></div>
                                <div style={{
                                    paddingLeft: "25px",
                                    paddingBottom: "10px",
                                    height:"100%",
                                }}><h1 style={{
                                    paddingLeft: "25px"
                                }}>Busses that haven't arrived</h1>
                                <div className="bus-list" style={{
                                    marginRight: "5px",
                                    width: "50%",
                                    height: "100%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "space-evenly",
                                    alignItems: "center",
                                    flexWrap: "wrap"
                                }}>
                                    {
                                        busses?.notHere?.map((bus, index) => {
                                            return (
                                                <div key={index} className="bus mobliefriendly" style={{
                                                    width: "100%",
                                                    height: "30%",
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    border: "1px solid black",
                                                    borderRadius: "5px",
                                                    margin: "5px"
                                                }}>
                                                    <div className="bus-name mobliefriendly-text">{bus.town}</div>
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        busses?.notHere?.length == 0 ? <div style={{
                                            width: "100%",
                                            height: "30%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            border: "1px solid black",
                                            borderRadius: "5px",
                                            margin: "5px"
                                        }}>
                                            <div className="bus-name mobliefriendly">All busses are here!</div>
                                        </div> : null
                                    }
                                </div></div>
                                
                        </div>
                    </main>
                    <div id="backdrop" />
                </>
            }
        </>

    )
}