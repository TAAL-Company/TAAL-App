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
import { useTranslator } from "../../Utility/TranslationProvider";

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
  startTimeLoop: "",
  endTimeLoop: "",
  stationid: "",
  Loopnumber: null,
  currdateAndTime: "",
  dataEntered: "",
};

export default function TaskComp(props) {
  const { translate, currentLanguage } = useTranslator();
  const [, set_obj_time] = useState(null);
  const [myCurrent, setMyCurrent] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [dataEntered, setDataEntered] = useState(props.dataEntered === undefined ? "" : props.dataEntered);
  const [translatedTitle, setTranslatedTitle] = useState(props.title);
  const [translatedContent, setTranslatedContent] = useState(parseContent(props.content));

  useEffect(() => {
    const doTranslate = async () => {
      if (props.title) {
        const title = await translate(props.title, currentLanguage);
        setTranslatedTitle(title);
      }
      if (props.content) {
        const content = await translate(parseContent(props.content), currentLanguage);
        setTranslatedContent(content);
      }
    };
    doTranslate();
  }, [props.title, props.content, currentLanguage, translate]);
  // console.log("dataEntered1212 ", dataEntered);


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

  useEffect(() => {
    // Listen for network state changes
    const handleOnline = () => {
      const savedData = localStorage.getItem("postDataTime");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("navigator.onLine Sending saved data to the server:", parsedData);

        // Send each saved task to the server
        parsedData.forEach((task) => {
          postDataTime(task);
        });

        // Clear the saved data after sending
        localStorage.removeItem("postDataTime");
      }
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  //this if handle publish the data in the 'Data Time' table for each task the user has done
  if (props.index === props.currentIndex) {
    if (objTime.idTask === 0) {
      //first tesk in the route
      objTime.idTask = props.taskId;
      objTime.task_location = props.task_location;
      objTime.startTime = dateAndTime;
      // Initialize loop/session fields
      if (props.loopMeta) {
        objTime.startTimeLoop = dateAndTime;
      }
      // Prefer loop stationId, else from props
      if (props.loopMeta?.stationId || props.stationId) {
        objTime.stationid = props.loopMeta?.stationId || props.stationId;
      }
      // Set loop number for the first task occurrence (1-based). Null if not in loop
      objTime.Loopnumber = props.loopMeta?.iterationIndex ?? null;
      // Keep previous meta to detect iteration boundaries
      objTime._prevLoopMeta = props.loopMeta || null;
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

      // Determine if we crossed a loop iteration boundary (or loop changed)
      const prevMeta = objTime._prevLoopMeta;
      const nextMeta = props.loopMeta || null;
      const loopBoundary = prevMeta && (
        !nextMeta ||
        nextMeta.loopId !== prevMeta.loopId ||
        nextMeta.iterationIndex !== prevMeta.iterationIndex
      );
      if (loopBoundary) {
        objTime.endTimeLoop = dateAndTime;
      }

      if (localStorage.getItem("taskIdForApi") === 0) {
        localStorage.setItem("taskIdForApi", objTime.idTask);
      } else if (localStorage.getItem("taskIdForApi") !== objTime.idTask) {
        //If it is not equal to this, then it means that the user has finished the task
        localStorage.setItem("taskIdForApi", objTime.idTask);
        objTime.currdateAndTime = localStorage.getItem("whenAssisted");
        // Ensure Loopnumber reflects the completed occurrence's iteration
        objTime.Loopnumber = prevMeta?.iterationIndex ?? null;

        if (navigator.onLine) {
          console.log("navigator.onLine"+navigator.onLine);
          postDataTime(objTime); // Send data to the server
        } else {
          console.log("navigator.onLine"+navigator.onLine);

          // Save data locally as an array
          const existingData = localStorage.getItem("postDataTime");
          const dataArray = existingData ? JSON.parse(existingData) : [];
          dataArray.push(objTime);
          localStorage.setItem("postDataTime", JSON.stringify(dataArray));
        }

        objTime.dataEntered = "";
        localStorage.setItem("whenAssisted", "1");
      }

      //rest the data to the next tesk:
      objTime.idTask = props.taskId;
      objTime.task_location = props.task_location;
      objTime.startTime = objTime.endTime;
      objTime.endTime = "";

      // If we are entering a (new) loop iteration, set startTimeLoop and station id for the new iteration
      const prevMeta2 = objTime._prevLoopMeta;
      const nextMeta2 = props.loopMeta || null;
      const enteringLoop = (!!nextMeta2 && (!prevMeta2 || nextMeta2.loopId !== prevMeta2.loopId || nextMeta2.iterationIndex !== prevMeta2.iterationIndex));
      if (enteringLoop) {
        objTime.startTimeLoop = objTime.startTime;
        objTime.stationid = nextMeta2?.stationId || props.stationId || objTime.stationid;
      }
      // Set loop number for the new current task occurrence
      objTime.Loopnumber = nextMeta2?.iterationIndex ?? null;
      objTime._prevLoopMeta = nextMeta2;
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

      // Last task: if we were in a loop, close loop time as well
      if (objTime._prevLoopMeta) {
        objTime.endTimeLoop = dateAndTime;
      }

      if (localStorage.getItem("taskIdForApi") === 0) {
        //in case there is only one tesk
        localStorage.setItem("taskIdForApi", objTime.idTask);
      } else if (localStorage.getItem("taskIdForApi") !== objTime.idTask) {
        //If it is not equal to this, then it means that the user has finished the task
        localStorage.setItem("taskIdForApi", objTime.idTask);
        objTime.currdateAndTime = localStorage.getItem("whenAssisted");
        // For the final task, set Loopnumber based on the last known loop meta
        objTime.Loopnumber = objTime._prevLoopMeta?.iterationIndex ?? null;

        if (navigator.onLine) {
          console.log("navigator.onLine"+navigator.onLine);
          postDataTime(objTime); // Send data to the server
        } else {
          console.log("navigator.onLine"+navigator.onLine);

          // Save data locally as an array
          const existingData = localStorage.getItem("postDataTime");
          const dataArray = existingData ? JSON.parse(existingData) : [];
          dataArray.push(objTime);
          localStorage.setItem("postDataTime", JSON.stringify(dataArray));
        }

        objTime.dataEntered = "";
        localStorage.setItem("whenAssisted", "1");
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
                  fontSize: "3.5vw",
                  textAlign: routes_ltr.includes(
                    parseInt(localStorage.getItem("route_id"))
                  )
                    ? ""
                    : "right",
                }}
              >
                {translatedTitle}
              </div>
              <div
                className="textTaskComp"
                style={{
                  fontSize: "2.8vw",
                  textAlign:
                    localStorage.getItem("route_id") == 3271 ? "" : "right",
                }}
              >
                {translatedContent}
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
