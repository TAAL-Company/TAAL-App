import React, { useState,useEffect } from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import LogoLogin from "../../images/logoTaal.svg";
import "./styleProgressBar.css";


export default function ProgressBarComp(props) {

    const [completed, setCompleted] = useState(props.completed);

    useEffect(() => {
        setCompleted(props.completed);
    }, [props.completed])


    return (
        <div className="progressBarWarpper" >
            <img
                src={LogoLogin}
                className="LogoLogin"
                alt="logo"
            ></img>
            <ProgressBar
                completed={completed}
                maxCompleted={100}
                className="wrapper"
                barContainerClassName="container"
                // completedClassName="barCompleted"
                // labelClassName="label"
                height="10px" 
                bgColor = "#256FA1" 
                labelSize="10px"
                />
        </div>
    )
};