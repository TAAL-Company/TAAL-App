import React, { useRef, useEffect, createRef, useState } from "react";
import { postDataTime } from "../api";
// import { BsFillVolumeUpFill } from 'react-icons/bs';
import AudioIcon from "../assets/AudioIcon";
import CheckIcon from "../assets/CheckIcon";
import styled from "styled-components";
import { parseContent, getTimeInUTC } from "./functions";
import "./taskCompStyle.css";
import WeightPopup from "./WeightPopup";
import Swal from "sweetalert2";

const IS_NODE = true;

//obj for save the Length of time it took the user to do the task
let objTime = {
  userName: "",
  idUser: 0,
  task_location: "",
  idTask: 0,
  route_id: 0,
  site_id: 0,
  route_title: "",
  startTime: "",
  endTime: "",
  currdateAndTime: "",
  dataEntered: "",
};

export default function TaskComp(props) {
  const [, set_obj_time] = useState(null);
  const [myCurrent, setMyCurrent] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [dataEntered, setDataEntered] = useState(props.dataEntered === undefined ? "" : props.dataEntered);
  console.log("dataEntered1212 ", dataEntered);


  let dateAndTime = ''

  if (IS_NODE) {
    dateAndTime = getTimeInUTC();
  } else {
    const currDate = new Date().toLocaleDateString("en-GB");
    const currTime = new Date().toLocaleTimeString("en-GB");
    dateAndTime = currDate + " " + currTime;
  }

  const routes_ltr = [3271, 3304];

  objTime.userName = localStorage.getItem("userName");
  objTime.site_id = localStorage.getItem("site_id");
  objTime.route_id = localStorage.getItem("route_id");
  objTime.route_title = localStorage.getItem("route_title");

  if (IS_NODE) {
    // "UserNODEid", UserNODEid.id
    objTime.idUser = localStorage.getItem("UserNODEid");
  } else {
    objTime.idUser = localStorage.getItem("userID");
  }


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
      if (IS_NODE) {
        dateAndTime = getTimeInUTC();
      } else {
        const currDate = new Date().toLocaleDateString("en-GB");
        const currTime = new Date().toLocaleTimeString("en-GB");
        dateAndTime = currDate + " " + currTime;
      }

      objTime.endTime = dateAndTime;

      if (localStorage.getItem("taskIdForApi") === 0) {
        localStorage.setItem("taskIdForApi", objTime.idTask);
      } else if (localStorage.getItem("taskIdForApi") !== objTime.idTask) {
        //If it is not equal to this, then it means that the user has finished the task
        localStorage.setItem("taskIdForApi", objTime.idTask);
        objTime.currdateAndTime = localStorage.getItem("whenAssisted");
        postDataTime(objTime); //api request to wp db
        objTime.dataEntered = ""
        localStorage.setItem("whenAssisted", "1")
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
      if (IS_NODE) {
        dateAndTime = getTimeInUTC();
      } else {
        const currDate = new Date().toLocaleDateString("en-GB");
        const currTime = new Date().toLocaleTimeString("en-GB");
        dateAndTime = currDate + " " + currTime;
      }

      objTime.endTime = dateAndTime;

      if (localStorage.getItem("taskIdForApi") === 0) {
        //in case there is only one tesk
        localStorage.setItem("taskIdForApi", objTime.idTask);
      } else if (localStorage.getItem("taskIdForApi") !== objTime.idTask) {
        //If it is not equal to this, then it means that the user has finished the task
        localStorage.setItem("taskIdForApi", objTime.idTask);
        objTime.currdateAndTime = localStorage.getItem("whenAssisted");
        postDataTime(objTime); //api request to wp db
        objTime.dataEntered = ""
        localStorage.setItem("whenAssisted", "1")
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
    <div
      className="containerWrapper"
      style={{
        width: props.wrapperWidth ? props.wrapperWidth : "50%",
        height: props.height ? props.height : "90px",//251.72px
      }}
      key={props.index}
    >
      <div
        className="taskContainer"
        style={{
          height: props.wideCaro
            ? props.wideCaro
            : isFocused()
              ? "100%"
              : "60%",
          backgroundColor: decideColor(props.didFinished),
        }}
      >
        <div
          className="whiteContainer"
          style={{
            width: isFocused() && props.wideCaro === undefined ? "90%" : "80%",
            height: isFocused() && props.wideCaro === undefined ? "90%" : "80%",
          }}
        >
          <div
            className="imageWrapper"
            style={{
              maxHeight:
                isFocused() && props.wideCaro === undefined ? "58%" : "100%",
              // borderWidth: isFocused() && props.wideCaro === undefined ? 1 : "0"
            }}
          >
            <img
              alt={"task image"}
              src={
                props.imgUrl
                  ? props.imgUrl
                  : "https://globalimpactnetwork.org/wp-content/themes/globalimpact/images/no-image-found-360x250.png"
                  // : "https://planner.taal.link/static/media/TaskImage.3014df9eff903a04f142.png"
              }
              className=" imgStyle"
            />
          </div>
          <div
            className="topBar"
            style={{
              display:
                isFocused() && props.wideCaro === undefined ? "flex" : "none",
              direction: routes_ltr.includes(
                parseInt(localStorage.getItem("route_id"))
              )
                ? "rtl"
                : "ltr",
            }}
          >
            <div style={{ width: "30%", height: "100%", padding: 0 }}>
              <AudioIcon audioUrl={props.audioUrl} />
            </div>
            <div style={{ height: "100%", width: "70%", padding: 0 }}>
              <div
                className="textTaskComp"
                style={{
                  fontSize: "2.8vw",
                  textAlign: routes_ltr.includes(
                    parseInt(localStorage.getItem("route_id"))
                  )
                    ? ""
                    : "right",
                }}
              >
                {props.title}
              </div>
              <div
                className="textTaskComp"
                style={{
                  fontSize: "2.8vw",
                  textAlign:
                    localStorage.getItem("route_id") == 3271 ? "" : "right",
                }}
              >
                {parseContent(props.content)}
                {props.taskType === "specialTask" ?
                  <div style={{
                    display: "flex",
                    flexDirection: "row-reverse",
                  }}>
                    <p
                      style={{
                        marginLeft: "10px"
                      }}

                    >{props.language !== 'English'
                      ? " משקל "
                      : " משקל "}</p>
                    <input
                      style={{
                        width: " 32px",
                        height: "20px"
                      }}
                      type='number'
                      step="50"
                      min={1}
                      onChange={(e) => {
                        objTime.dataEntered = e.target.value
                        setDataEntered(e.target.value)
                      }}
                    />
                    <button
                      style={{
                        width: " 40px",
                        height: "20px",
                        backgroundColor: "#00ff00",
                      }}
                      type="button" > אישור </button>

                  </div>
                  :
                  ""
                }

                {/* <button onClick={() => setModalOpen(true)}>weight popup</button> */}
                {/* <h6>{dataEntered}</h6> */}
                {/* {
                  modalOpen ?
                    <WeightPopup key={props.index} modalOpen={modalOpen} objTime={objTime}  setDataEntered={setDataEntered} setModalOpen={setModalOpen}/> 
                    : <></>
                } */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
