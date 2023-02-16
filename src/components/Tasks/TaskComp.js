import React, { useRef, useEffect, createRef, useState } from "react";
import { postDataTime } from "../api";
// import { BsFillVolumeUpFill } from 'react-icons/bs';
import AudioIcon from "../assets/AudioIcon";
import CheckIcon from "../assets/CheckIcon";
import styled from "styled-components";
import { parseContent } from "./functions";
import "./taskCompStyle.css"

//obj for save the Length of time it took the user to do the task
let objTime = {
  userName: "",
  idUser: 0,
  task_location: "",
  idTask: 0,
  route_id: 0,
  route_title: "",
  startTime: "",
  endTime: "",
};

export default function TaskComp(props) {

  const [, set_obj_time] = useState(null);
  const [myCurrent, setMyCurrent] = useState();

  const currDate = new Date().toLocaleDateString("en-GB");
  const currTime = new Date().toLocaleTimeString("en-GB");
  let dateAndTime = currDate + " " + currTime;

  objTime.userName = localStorage.getItem("userName");
  objTime.route_id = localStorage.getItem("route_id");
  objTime.idUser = localStorage.getItem("userID");
  objTime.route_title = localStorage.getItem("route_title");

  //this if handle publish the data in the 'Data Time' table for each task the user has done
  if (props.index === props.currentIndex) {
    if (objTime.idTask === 0) {
      //first tesk in the route
      objTime.idTask = props.taskId;
      objTime.task_location = props.task_location;
      objTime.startTime = dateAndTime;
      localStorage.setItem("taskIdForApi", 0);
    } else if (objTime.idTask !== props.taskId) {
      //Prevents double case
      const currDate = new Date().toLocaleDateString();
      const currTime = new Date().toLocaleTimeString();
      let dateAndTime = currDate + " " + currTime;

      objTime.endTime = dateAndTime;

      if (localStorage.getItem("taskIdForApi") === 0) {
        localStorage.setItem("taskIdForApi", objTime.idTask);
      } else if (localStorage.getItem("taskIdForApi") !== objTime.idTask) {
        //If it is not equal to this, then it means that the user has finished the task
        localStorage.setItem("taskIdForApi", objTime.idTask);
        postDataTime(objTime); //api request to wp db
      }

      //rest the data to the next tesk:
      objTime.idTask = props.taskId;
      objTime.task_location = props.task_location;
      objTime.startTime = objTime.endTime;
      objTime.endTime = "";
    }

    if (
      props.lastOne &&
      localStorage.getItem("taskIdForApi") != objTime.idTask
    ) {
      //handle the last task
      const currDate = new Date().toLocaleDateString();
      const currTime = new Date().toLocaleTimeString();
      let dateAndTime = currDate + " " + currTime;

      objTime.endTime = dateAndTime;

      if (localStorage.getItem("taskIdForApi") === 0) {
        //in case there is only one tesk
        localStorage.setItem("taskIdForApi", objTime.idTask);
      } else if (localStorage.getItem("taskIdForApi") !== objTime.idTask) {
        //If it is not equal to this, then it means that the user has finished the task
        localStorage.setItem("taskIdForApi", objTime.idTask);
        postDataTime(objTime); //api request to wp db
      }
    }
  }

  const decideColor = (type) => {
    if (type == null && isFocused()) return "orange";
    else if (type === true) return "green";
    else return "red";
  };

  const isFocused = () => props.index === props.currentIndex;

  return (
    <div className="containerWrapper"
      style={{
        width: props.wrapperWidth ? props.wrapperWidth : "50%",
        height: props.height ? props.height : "90px"
      }}
    >
      <div className="taskContainer"
        style={{
          height: props.wideCaro ? props.wideCaro : isFocused() ? "100%" : "60%",
          backgroundColor: decideColor(props.didFinished),
        }}
      >
        <div className="whiteContainer"
          style={{
            width: isFocused() && props.wideCaro === undefined ? "90%" : "80%",
            height: isFocused() && props.wideCaro === undefined ? "90%" : "80%",

          }}
        >
          <div className="imageWrapper"
            style={{
              maxHeight: isFocused() && props.wideCaro === undefined ? "58%" : "100%",
              // borderWidth: isFocused() && props.wideCaro === undefined ? 1 : "0"
            }}
          >
            <img
              alt={"task image"}
              src={
                props.imgUrl
                  ? props.imgUrl
                  : "https://globalimpactnetwork.org/wp-content/themes/globalimpact/images/no-image-found-360x250.png"
              }
              className=" imgStyle"
            />
          </div>
          <div className="topBar"
            style={{
              display: isFocused() && props.wideCaro === undefined ? "flex" : "none",
            }}

          >
            <div style={{ width: "20%", height: "auto", marginTop: "auto" }}>
              <AudioIcon audioUrl={props.audioUrl} />
            </div>
            <div style={{ height: "100%", width: "79.5%", padding: 0 }}>
              <div className="textTaskComp" style={{fontSize: "3.5vw"}}>{props.title}</div>
              <div className="textTaskComp" style={{fontSize: "2.8vw"}}>{parseContent(props.content)}</div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}