import { useState, useRef, useEffect } from "react";
export default function Popup(props) {
    const [isHidden, setIsHidden] = useState(props.hidden);
    useEffect(()=>{
        setIsHidden(props.hidden)
    },[props.hidden])
    return (
        <div style={
            {
                display: isHidden ? "none" : "block"
            }
         } className="modal" tabIndex={-1} role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{props.title}</h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={()=>{
                                    props.setHiddenn(true)
                                }}
                            >
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {props.children}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={
                                ()=>{
                                    props.onSave()
                                }
                            }>
                                Save changes
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                data-dismiss="modal"
                                onClick={()=>{
                                    props.setHiddenn(true)
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
        </div>


    )
}