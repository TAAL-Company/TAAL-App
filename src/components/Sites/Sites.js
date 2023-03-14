import React, { useState, useEffect, useRef } from "react";
import SiteComp from "./SiteComp.js";
import Carousel, { consts } from "react-elastic-carousel";
import axios from "axios/index";
import BarcodeReader from "./BarcodeReader";
// import BarcodeComp from './BarcodeComp'
import AudioIcon from "../assets/AudioIcon";
import "./Sites.css";
import { isLoggedIn, handleLogout } from "../functions";
import { navigate } from "@reach/router";
import styled from "styled-components";
import wpConfig from "../../wp-config";
import Navbar from "../Nav/Navbar";
import {
  getingData_Tasks,
  getingDataTasks,
  getingDataRoutes,
  getingDataPlaces,
  getingData_Routes,
  getingData_Places,
} from "../api";
import {
  getPlacesList,
  getTasksList,
  trasformObject,
  transformArrayOfObjects,
  extractPathForSite,
  getUserTasksFromRouteList,
  addStationDetailsToTask,
  getRoutesOfUser,
  getRoutesOfUserInTheSite,
} from "./functions";
import { Divider } from "../assets/Styles";
import Spinner from "../assets/Spinner";
import ProgressBarComp from "../assets/progressBar.js";
import { useTranslation } from "react-i18next";
import { internetConnection } from "../functions";
import clientConfig from "../../client-config";

let placesList = [];
let tasksList = [];

let routesInfo, taskInformation;

export default function Sites(props) {
  const { user, user_places, userTasks } = props;
  const [userId, setUserId] = useState("a71f5b1f-f12c-49c3-9c85-05999062329c"); //localStorage.getItem("userID"));
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [lineLength, setLineLength] = useState(52);
  const dateRef = useRef("");
  const { t } = useTranslation();
  const internetStatus = useRef(true);
  const currDate = new Date().toLocaleDateString();
  const currTime = new Date().toLocaleTimeString();
  const [completed, setCompleted] = useState(5);
  const [numOfTasks, setnumOfTasks] = useState(0);
  const [allRoutes, setAllRoutes] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [allRoutesOfUser, setAllRoutesOfUser] = useState([]);
  const [allTasksOfUser, setAllTasksOfUser] = useState([]);
  const [allPlacesOfUser, setAllPlacesOfUser] = useState([]);
  const users_ltr = [39];
  useEffect(() => {
    console.log("allTasks: ", allTasks);
  }, [allTasks]);
  useEffect(() => {
    console.log("user_places: ", props.user_places);
  }, [props.user_places]);

  useEffect(() => {
    console.log("after X allPlacesOfUser: ", allPlacesOfUser);
    props.actions.changePlaces(allPlacesOfUser, dateRef.current);

    setLoading(false);
  }, [allPlacesOfUser]);

  useEffect(() => {
    if (completed > 100) {
      setCompleted(100);
    }
    console.log("completed: ", completed);
  }, [completed]);

  const fetchData = async () => {
    setLoading(true);
    try {
      setAllTasks(await getingData_Tasks(setCompleted, setnumOfTasks)); //get request for tasks
      setAllRoutes(await getingData_Routes()); //get request for routes
      setAllPlaces(await getingData_Places()); //get request for places
    } catch (error) {
      console.log("Error");
      console.error(error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (allPlaces.length > 0 && allRoutes.length > 0 && allTasks.length > 0) {
      getDataFunction();
    }
  }, [allRoutes, allTasks, allPlaces]);

  //barcode code
  // const onchange = async (scanResult) => {

  //   localStorage.setItem("site_id", scanResult);
  //   if (!(scanResult === "error")) {
  //     let temp = transformArrayOfObjects(props.user_places.user_places);
  //     // scan the barcode and compare it with the redux info
  //     if (placesList.hasOwnProperty(scanResult) || placesList.length === 0) {
  //       if (temp.hasOwnProperty(scanResult)) {

  //         let tempTransformObject = await trasformObject(props.user_tasks.user_tasks);
  //         let [separateList, cleanList] = extractPathForSite(
  //           props.user_tasks.user_tasks,
  //           scanResult,
  //           tempTransformObject
  //         );
  //         props.actions.visitPlaces(scanResult);
  //         props.actions.changeCurrentTasks(separateList);
  //         props.actions.changeCurrentTasksList(cleanList);
  //         localStorage.setItem("route_title", placesList[scanResult].name);
  //         //navigate to Tasks page
  //         setScanning(false);
  //         navigate(`/Tasks/${user.user.username}`); //  { state={}, replace=false }
  //       } else if (placesList.length > 0) {
  //         // pull default route
  //         if (placesList[scanResult].acf["defaultPath"]) {
  //           let lst = getTasksList(
  //             taskInformation,
  //             routesInfo[placesList[scanResult].acf["defaultPath"][0].ID].acf
  //               .tasks
  //           );

  //           props.actions.changeCurrentTasks(
  //             extractPathForSite(lst, scanResult)
  //           );
  //           setScanning(false);
  //           navigate(`/Tasks/${user.user.username}`);
  //         } else {
  //           setStartOver(!startOver);
  //         }
  //       }
  //     } else {
  //       // TODO: barcode doesn't exist
  //     }
  //   }
  // };

  async function handleChildImgClick() {
    const site_id = localStorage.getItem("site_id");
    console.log("Child img clicked");
    console.log("handleChildImgClick" + typeof site_id);
    console.log("allPlacesOfUser", allPlacesOfUser);
    let site_name = allPlacesOfUser.find((place) => place.id === site_id);
    localStorage.setItem("site_title", site_name.name);

    console.log(
      "placesList.hasOwnProperty(site_id)",
      placesList.hasOwnProperty(site_id)
    );

    let routesOfUserInTheSite = getRoutesOfUserInTheSite(
      allRoutesOfUser,
      site_id
    );

    console.log("routesOfUserInTheSite", routesOfUserInTheSite);

    localStorage.setItem("route_title", routesOfUserInTheSite[0].name);
    localStorage.setItem("route_id", routesOfUserInTheSite[0].id);

    let [separateList, cleanList] = extractPathForSite(
      allTasks,
      routesOfUserInTheSite[0].tasks,
      site_id
    );

    props.actions.visitPlaces(site_id);
    props.actions.changeCurrentTasks(separateList);
    props.actions.changeCurrentTasksList(cleanList);
    // localStorage.setItem("site_title", placesList[site_id].name);
    //navigate to Tasks page
    setScanning(false);
    navigate(`/Tasks/${user.user.username}`, {
      state: { routeForShow: routesOfUserInTheSite[0] },
    });
  }

  /*
        BreakPoints will determine the behavior of our scroll bar according to the size
        * Should fix the trasfer from width 1 to 250
    */
  const breakPoints = [
    { width: 1, itemsToShow: 3, itemsToScroll: 1 },
    { width: 550, itemsToShow: 3, verticalMode: false, isRTL: true },
    { width: 700, itemsToShow: 3, verticalMode: false, isRTL: true },
    { width: 878, itemsToShow: 4, verticalMode: false, isRTL: true },
    {
      width: 900,
      verticalMode: false,
      itemsToShow: 4,
      itemsToScroll: 2,
      isRTL: true,
    },
  ];

  // try

  const getDateInfo = () => {
    const date = new Date();
    dateRef.current =
      date.getFullYear().toString() +
      "-" +
      (date.getMonth() < 9
        ? "0" + (date.getMonth() + 1).toString()
        : (date.getMonth() + 1).toString()) +
      "-" +
      (date.getDate() < 10
        ? "0" + date.getDate().toString()
        : date.getDate().toString());
    return dateRef.current;
  };

  const clearCache = () => {
    // Remove all cookies
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      console.log("REMOVE ALL COOKIE");
    });

    // Clear the cache
    if (window.caches) {
      window.caches.keys().then(function (cacheNames) {
        cacheNames.forEach(function (cacheName) {
          window.caches.delete(cacheName);
          console.log("REMOVE ALL CACHE");
        });
      });
    }
  };

  const getDataFunction = async () => {
    console.log("allRoutes", allRoutes);
    console.log("allTasks", allTasks);
    console.log("allPlaces", allPlaces);
    clearCache();

    //get only the routes that belong to the user
    let allRoutesOfUserTemp = allRoutes.filter((route) => {
      let userExists = route.students.find((user) => user.id === userId);
      if (userExists !== undefined) return route;
    });

    setAllRoutesOfUser(allRoutesOfUserTemp);
    console.log("allRoutesOfUserTemp", allRoutesOfUserTemp);
    console.log("userId", userId);

    let idOfUserPlaces = [];

    allRoutesOfUserTemp.forEach((route) => {
      //get only the sites that belong to the user
      route.sites.forEach((item) => {
        let temp = allPlaces.find((place) => place.id === item.id);
        console.log("temp", temp);
        if (!idOfUserPlaces.includes(temp.id)) {
          console.log("temp  !!");

          //get the site only once
          setAllPlacesOfUser((prevState) => prevState.concat([temp]));
          idOfUserPlaces.push(item.id);
        }
      });

      route.tasks.forEach((task, index) => {
        let tempTask = allTasks.find((item) => task.taskId === item.id);
        route.tasks[index].stations = tempTask.stations;
        route.tasks[index].title = tempTask.title;
        route.tasks[index].audio_url = tempTask.audio_url;
        route.tasks[index].picture_url = tempTask.picture_url;
        let updatedContent = tempTask.subtitle;
        if (tempTask.subtitle.includes("<p>")) {
          updatedContent = tempTask.subtitle.replace("</p>", "");
          updatedContent = updatedContent.replace("<p>", "");
        }
        route.tasks[index].subtitle = updatedContent;
        route.tasks[index].didFinish = null;
      });
    });
    console.log("allRoutesOfUserTemp", allRoutesOfUserTemp);

    console.log("idOfUserPlaces", idOfUserPlaces);

    // placesList = await trasformObject(allPlaces);
    // routesInfo = await transformArrayOfObjects(allRoutes);
    // taskInformation = await trasformObject(allTasks);

    // console.log("after x placesList: ", placesList);
    // console.log("after x routesInfo : ", routesInfo);
    // console.log("after x taskInformation: ", taskInformation);

    // let userRoutes = await getUserTasksFromRouteList(allRoutes, userId);

    // console.log("after  userRoutes: ", userRoutes);

    // let newTaskList = await getTasksList(taskInformation, userRoutes);
    // console.log("after getTasksList: ", newTaskList);

    // newTaskList = addStationDetailsToTask(newTaskList, placesList);
    // console.log("after newTaskList: ", newTaskList);

    //

    // let temp1 = getPlacesList(placesList, newTaskList);
    props.actions.changeTasks(allTasks, dateRef.current);
    console.log("allPlacesOfUser hh: ", allPlacesOfUser);

    // props.actions.enterApp(dateRef.current);
  };
  const isCurrentSite = (itemId) =>
    itemId === props.user_places.places_location;

  const getFirstItemLocation = () => {
    if (props.user_places.places_location !== -1)
      return props.user_places.places_location;
    else return props.user_places.user_places.length - 1;
  };
  const onChangeSite = (currentItem, pageIndex) => {
    if (screen.width < 1024 && user_places.user_places.length > 2) {
      if (currentItem.index !== user_places.user_places.length - 2)
        setLineLength(52);
      else if (lineLength !== 32) setLineLength(32);
    }
  };

  return (
    <React.Fragment>
      {/* <h1>
        current datetime: {currDate} {currTime}
      </h1> */}
      {isLoggedIn() ? (
        // userId
        <div className="Sites">
          <Navbar origin={"Sites"} user_data={props.user} />

          <div
            className="containerSites"
            style={{
              direction: users_ltr.includes(parseInt(userId)) ? "rtl" : "ltr",
            }}
          >
            <div
              className="helloAera"
              style={{
                direction: users_ltr.includes(parseInt(userId)) ? "rtl" : "ltr",
                paddingRight: users_ltr.includes(parseInt(userId))
                  ? "0"
                  : "2em",
                paddingLeft: users_ltr.includes(parseInt(userId)) ? "2em" : "0",
              }}
            >
              {users_ltr.includes(parseInt(userId)) ? (
                <>
                  <h5 className="helloTitle">Hello {user.user.hebrewName} </h5>
                  <h1 className="addText">!Happy to see you</h1>
                </>
              ) : (
                <>
                  <h5 className="helloTitle">{user.user.hebrewName} שלום</h5>{" "}
                  <h1 className="addText">!שמחים לראותך</h1>
                </>
              )}
            </div>
            {/* <div className="barcode">
              <div className="scanner">
                <div className="barcodeBox">
                  <BarcodeReader
                    onchange={(e) => {
                      onchange(e);
                    }}
                    scanning={scanning}
                  />
                </div>
              </div>
              <div className="scanText">
                <div className="titleText">
                  <p id="scanTextStyle">{t("scan_barcode.male")}</p>
                </div>
                <div className="audioAssist">
                  <AudioIcon
                    innerStyle={{ width: "80%", height: "80%" }}
                    width={60}
                    onPress={() => console.log("pressed audio")}
                  />
                </div>
              </div>
            </div> */}
            <div className="sitesBar">
              <div className="sitesBar viewItems">
                {/* <Divider width={screen.width * 0.9} /> */}

                {loading ? <ProgressBarComp completed={completed} /> : <></>}

                {/* {!loading ? <Connector height={lineLength} /> : <></>} */}
                {/* <Carousel
                  onResize={currentBreakPoint => console.log(currentBreakPoint)}
                  breakPoints={breakPoints}
                  verticalMode
                  initialFirstItem={getFirstItemLocation()}
                  onChange={onChangeSite}
                > */}
                <div className="allPlacesOfUser">
                  {allPlacesOfUser.map((item, index) => {
                    return (
                      <SiteComp
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        imgUrl={item.picture_url ? item.picture_url : ""}
                        didVisit={
                          isCurrentSite(index) ? "current" : item.didVisit
                        }
                        onImgClick={handleChildImgClick}
                        value={0}
                        audioUrl={item.audio_url ? item.audio_url : ""}
                      />
                    );
                  })}
                </div>
                {/* </Carousel> */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        handleLogout()
      )}
    </React.Fragment>
  );
}

const Connector = styled.hr`
  background-color: #aab1b1;
  position: ${(props) => (props.position ? props.position : "fixed")};
  width: 3px;
  width: ${(props) => (props.width ? props.width : "2px")};

  margin: 0;
  height: ${(props) => (props.height ? props.height : 0)}vh;
  left: 50vw;
  bottom: ${(props) => (props.bottom ? props.bottom : 0)}vh;
  top: ${(props) => (props.top ? props.top : 54)}vh;
  z-index: 0;
  @media (min-width: 1024px) {
    width: ${(props) => (props.width ? props.width : 86.5)}vw;
    height: 3px;
    top: ${(props) => (props.top ? props.top : 85)}vh;
    left: 6.8vw;
    @media (min-width: 1224px) {
      width: ${(props) => (props.width ? props.width : 90)}vw;
      left: 5vw;
    }
  }
`;
