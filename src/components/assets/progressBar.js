import React from "react";
import ProgressBar from "@ramonak/react-progress-bar";
import LogoLogin from "../../images/logoTaal.svg";
import "./styleProgressBar.css";


export default function ProgressBarComp(props) {
    console.log("test");

    return (
        <div className="progressBarWarpper" >
            <img
                src={LogoLogin}
                className="LogoLogin"
                alt="logo"
            ></img>
            <ProgressBar
                completed={60}
                maxCompleted={100}
                className="wrapper"
                barContainerClassName="container"
                completedClassName="barCompleted"
                labelClassName="label" />
        </div>
    )
};