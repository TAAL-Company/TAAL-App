import React, { Component } from 'react'
import { BsFillVolumeUpFill } from 'react-icons/bs';
import AudioIcon from '../assets/AudioIcon'
import './SiteComp.css'
import styled from 'styled-components'
import playIcon from "../../images/playIcon.svg";
import "./SiteCompStyle.css";



export default function SiteComp(props) {


    // function decideColor(type) {
    //     if (type === "current")
    //         return "orange";
    //     else if (type === true)
    //         return 'green';

    //     else
    //         return 'red';
    // }

    function handleImgClick() {
        try {
            console.log(props.id);
            localStorage.setItem("route_id", props.id);
            props.onImgClick();
        }
        catch {
            throw new Error("site is undefined 10");
        }
    }


    return (
        <div className="SiteContainer">
            <div className = "WhiteContainer">
                < div className="leftBox">
                    <AudioIcon
                        style={{ width: "50%" }}
                        audioUrl={props.audioUrl}
                    />
                </div>
                <div className="rightBox">
                    <div className="imgBox">
                        <img alt={'site image'} src={props.imgUrl || "https://globalimpactnetwork.org/wp-content/themes/globalimpact/images/no-image-found-360x250.png"} 
                        className="imgStyle" />
                    </div>
                    <div className="textBox">
                        <p className="siteTxt" >{props.name}</p>
                    </div>

                    <div className='startButtonWarpper' onClick={handleImgClick}>
                        <div className='startButtonText'>תחילת מסלול</div>
                        <img
                            src={playIcon}
                            className="playIcon"
                            alt="logo"

                        ></img>
                    </div>
                </div>
            </div>
        </div>

    );
}


// const WhiteContainer = styled.div`
//    height: 85%;
//     width: 90%;
//     display: flex;
//     padding: 2%;
//     @media (min-width: 1024px) {
//         flex-direction: row-reverse;
//         @media (min-width: 1300px) {
//             height: 85%;
//             width: 88%;
//         }
//     }
//     border-radius: 5pt;

//     overflow: hidden;
// `;
// const SiteContainer = styled.div`
//     @media (max-width: 1023px) {
//         height: 130px;
//         @media  (max-height: 570px) {
//             height: 120px;
//         }
//         @media (min-height: 800px) and (max-height: 879px) {
//             height: 170px;
//         }
//         @media (min-height: 720px) and (max-height: 799px) {
//             height: 145px;
//         }
//         @media (min-height: 880px) {
//             height: 190px;
//         }
//         @media (min-width: 480px){
//             width:340px;
//         }
//     }
//     @media (min-width: 1024px) {
//         height: 20vh;
//         @media (min-width: 1300px) {
//             width: 320px;
//             height: 24vh;
//         }
//     }
//     width: ${props => props.width ? props.width : 260}px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     border-radius: 5pt;

//     margin: 3%;
//     overflow: hidden;
// `;
