import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import BusSvG from './busSvg';
export default function helpPage(props){
    const [htmlCode, setHtmlCode] = useState(props.html);
    useEffect(()=>{
        setHtmlCode(props.html)
    },[props.html])
    return (
        <>
            <main>
                <div id="home" className="active">
                    <div style={{
                        paddingLeft: "25px",
                        paddingBottom: "10px",
                        height: "100%",
                    }}>
                        <div dangerouslySetInnerHTML={
                            {
                                __html: htmlCode
                            }
                        }
                        />
                    </div>

                </div>
            </main>
            <div id="backdrop" />
        </>

    )
}