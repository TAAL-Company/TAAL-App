import React, { Component } from "react";
import { BsFillVolumeUpFill } from "react-icons/bs";
import AudioIcon from "../assets/AudioIcon";
import "./SiteComp.css";
import styled from "styled-components";
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

  const userId = localStorage.getItem("userID");
  const users_ltr = [39];

  function handleImgClick() {
    try {
      console.log(props.id);
      localStorage.setItem("site_id", props.id);
      props.onImgClick();
    } catch {
      throw new Error("site is undefined 10");
    }
  }

  return (
    <div className="SiteContainer">
      <div className="WhiteContainer">
        <div className="leftBox">
          <AudioIcon style={{ width: "50%" }} audioUrl={props.audioUrl} />
        </div>
        <div className="rightBox">
          <div className="imgBox">
            <img
              alt={"site image"}
              src={
                props.imgUrl ||
                "https://globalimpactnetwork.org/wp-content/themes/globalimpact/images/no-image-found-360x250.png"
              }
              className="imgStyle"
            />
          </div>
          <div className="textBox">
            <p className="siteTxt">{props.name}</p>
          </div>

          {users_ltr.includes(parseInt(userId)) ? (
            <>
              <div className="startButtonWarpper" onClick={handleImgClick}>
                <div
                  className="startButtonText"
                  style={{ borderRadius: "6px 0px 0px 6px" }}
                >
                  Start route
                </div>
                <img
                  src={playIcon}
                  className="playIcon"
                  alt="logo"
                  style={{ transform: "rotate(180deg)" }}
                ></img>
              </div>
            </>
          ) : (
            <>
              <div className="startButtonWarpper" onClick={handleImgClick}>
                <div
                  className="startButtonText"
                  style={{ borderRadius: "0px 6px 6px 0px" }}
                >
                  תחילת מסלול
                </div>
                <img src={playIcon} className="playIcon" alt="logo"></img>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
