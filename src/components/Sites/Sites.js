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
  getPlacesList,
  getTasksList,
  trasformObject,
  transformArrayOfObjects,
  extractPathForSite,
  getUserTasksFromRouteList,
  addStationDetailsToTask,
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
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [lineLength, setLineLength] = useState(52);
  const dateRef = useRef("");
  const { t } = useTranslation();
  const internetStatus = useRef(true);
  const currDate = new Date().toLocaleDateString();
  const currTime = new Date().toLocaleTimeString();
  const [completed, setCompleted] = useState(5);

  useEffect(() => {
    if (completed > 100) {
      setCompleted(100);
    }
    console.log("completed: ", completed)
  }, [completed])
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCompleted((prevCompleted) => prevCompleted + 20);
  // if (completed >= 100) {
  //   clearInterval(interval);
  // }
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);


  const userNameApi = process.env.REACT_APP_USERNAME_ACCESSKEY;
  const passwordApi = process.env.REACT_APP_PASSWORD_ACCESSKEY;
  const base64encodedData = Buffer.from(`${userNameApi}:${passwordApi}`).toString('base64');


  const onchange = async (scanResult) => {

    localStorage.setItem("route_id", scanResult);
    if (!(scanResult === "error")) {
      let temp = transformArrayOfObjects(props.user_places.user_places);
      // scan the barcode and compare it with the redux info
      if (placesList.hasOwnProperty(scanResult) || placesList.length === 0) {
        if (temp.hasOwnProperty(scanResult)) {

          let tempTransformObject = await trasformObject(props.user_tasks.user_tasks);
          let [separateList, cleanList] = extractPathForSite(
            props.user_tasks.user_tasks,
            scanResult,
            tempTransformObject
          );
          props.actions.visitPlaces(scanResult);
          props.actions.changeCurrentTasks(separateList);
          props.actions.changeCurrentTasksList(cleanList);
          localStorage.setItem("route_title", placesList[scanResult].name);
          //navigate to Tasks page
          setScanning(false);
          navigate(`/Tasks/${user.user.username}`); //  { state={}, replace=false }
        } else if (placesList.length > 0) {
          // pull default route
          if (placesList[scanResult].acf["defaultPath"]) {
            let lst = getTasksList(
              taskInformation,
              routesInfo[placesList[scanResult].acf["defaultPath"][0].ID].acf
                .tasks
            );

            props.actions.changeCurrentTasks(
              extractPathForSite(lst, scanResult)
            );
            setScanning(false);
            navigate(`/Tasks/${user.user.username}`);
          } else {
            setStartOver(!startOver);
          }
        }
      } else {
        // TODO: barcode doesn't exist
      }
    }
  };

  async function handleChildImgClick() {
    const route_id = localStorage.getItem("route_id");
    let userPlacesList = transformArrayOfObjects(props.user_places.user_places);
    console.log('Child img clicked');
    console.log("handleChildImgClick" + route_id);
    console.log(userPlacesList);
    localStorage.setItem("route_title", userPlacesList[route_id].name);

    if (placesList.hasOwnProperty(route_id) || placesList.length === 0) {
      if (userPlacesList.hasOwnProperty(route_id)) {

        let tempTransformObject = await trasformObject(props.user_tasks.user_tasks);
        let [separateList, cleanList] = extractPathForSite(
          props.user_tasks.user_tasks,
          route_id,
          tempTransformObject
        );
        props.actions.visitPlaces(route_id);
        props.actions.changeCurrentTasks(separateList);
        props.actions.changeCurrentTasksList(cleanList);
        // localStorage.setItem("route_title", placesList[route_id].name);
        //navigate to Tasks page
        setScanning(false);
        navigate(`/Tasks/${user.user.username}`); //  { state={}, replace=false }
      } else if (placesList.length > 0) {
        // pull default route
        if (placesList[route_id].acf["defaultPath"]) {
          let lst = getTasksList(
            taskInformation,
            routesInfo[placesList[route_id].acf["defaultPath"][0].ID].acf
              .tasks
          );

          props.actions.changeCurrentTasks(
            extractPathForSite(lst, route_id)
          );
          setScanning(false);
          navigate(`/Tasks/${user.user.username}`);
        } else {
          setStartOver(!startOver);
        }
      }
    }


  }

  /*
        BreakPoints will determine the behavior of our scroll bar according to the size
        * Should fix the trasfer from width 1 to 250
    */
  const breakPoints = [
    { width: 1, itemsToShow: 2, itemsToScroll: 1 },
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

  const get = async (url, header) => {
    try {
      const res = await axios.get(url, header);
      if (res) {
        return res.data;
      }
    } catch (e) {
      console.log(e);
    }
  };

  // const getData = () => {
  //   const siteUrl = clientConfig.siteUrl;

  //   get(`${siteUrl}wp-json/wp/v2/users/`, {
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `basic ${base64encodedData}`,
  //     },
  //     params: {
  //       per_page: 99,
  //       "Cache-Control": "no-cache",
  //     },
  //   }).then((res) => {
  //     console.log("Users:", res);

  //     //  לא רץ בגלל שיש בעיה בקריאה מה DB
  //     //  שרה לוי לא מופיעה ב DB
  //   });
  // };

  // try

  const resetFirstTask = () => { };

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

  const checkForInternet = async () => {
    internetStatus.current = await internetConnection();
    return internetStatus.current;
  };

  useEffect(() => {
    (async () => {
      await getDataFunction();

    })();
  }, []);

  const getDataFunction = async () => {

    // Remove all cookies
    document.cookie.split(";").forEach(function (c) {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
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

    // const userLang = navigator.language || navigator.userLanguage;
    // getData();

    resetFirstTask();

    // Update the document title using the browser API once a day
    if (user.user.lastFetchDate !== getDateInfo()) {
      console.log("setLoading1: ", loading);
      setLoading(true);


      console.log("setLoading2: ", loading);
      // get all of the places
      await axios
        .get(wpConfig.getPlaces, {
          headers: {
            "Content-Type": "application/json",
            // Authorization: `basic ${base64encodedData}`,
          },
          params: {
            per_page: 70,
            "Cache-Control": "no-cache",
          },
          // headers: {
          //   Authorization: "Bearer " + localStorage.getItem("token"),
          // },
        })
        .then(async (places_res) => {
          // setPlacesList(trasformObject(places_res.data))
          placesList = await trasformObject(places_res.data);

          // get all of the tasks
          await axios
            .get(wpConfig.getTasks, {
              params: {
                per_page: 100,
                "Cache-Control": "no-cache",
              },
              headers: {
                "Content-Type": "application/json",
                // Authorization: `basic ${base64encodedData}`,
              },
            })
            .then(async (res) => {
              let max_pages = res.headers["x-wp-totalpages"];
              let arrayTemp = [];
              tasksList = res.data;
              let plusToCompleted = 100/max_pages;

              setCompleted((prevCompleted) => parseInt(prevCompleted + plusToCompleted));

              if (max_pages > 1) {
                console.log("YARD")
                for (let i = 2; i <= max_pages; i++) {
                  await axios
                    .get(wpConfig.getTasks, {
                      params: {
                        per_page: 100,
                        page: i,
                        "Cache-Control": "no-cache",
                      },
                      headers: {
                        "Content-Type": "application/json",
                        // Authorization: `basic ${base64encodedData}`,
                      },
                    })
                    .then(async (response) => {
                      setCompleted((prevCompleted) => parseInt(prevCompleted + plusToCompleted));
                      console.log("tasksList11: ");
                      Array.prototype.push.apply(tasksList, response.data);
                      // await this.state.tasksList.push(response.data);
                      // taskInformation = trasformObject(tasksList);
                      console.log("tasksList11: ", tasksList);
                      // console.log("taskInformation: ", taskInformation);
                    });


                }
              }



              // Get the user's routes
              await axios
                .get(wpConfig.getRoutes, {
                  params: {
                    per_page: 70,
                    "Cache-Control": "no-cache",
                  },
                  headers: {
                    "Content-Type": "application/json",
                    // Authorization: `basic ${base64encodedData}`,
                  },
                  // headers: {
                  //   Authorization: "Bearer " + localStorage.getItem("token"),
                  // },
                })
                .then(async (res) => {
                  console.log("maslolim: ", res.data);
                  // setDataRoutes(res.data)
                  routesInfo = transformArrayOfObjects(res.data);
                  console.log("routesInfo: ", routesInfo);

                  let userRoutes = await getUserTasksFromRouteList(
                    res.data,
                    user.user.id
                  );
                  console.log("userRoutes: ", userRoutes);


                  console.log("tasksListtttt: ", tasksList);
                  taskInformation = await trasformObject(tasksList);

                  console.log("taskInformation2: ", taskInformation);
                  console.log("taskInformation length: ", Object.keys(taskInformation).length);


                  console.log("before getTasksList - taskInformation: ", taskInformation);
                  console.log("before getTasksList - userRoutes: ", userRoutes);

                  let newTaskList = getTasksList(taskInformation, userRoutes);
                  console.log("after getTasksList: ", newTaskList);

                  newTaskList = addStationDetailsToTask(
                    newTaskList,
                    placesList
                  );

                  props.actions.changeTasks(newTaskList, dateRef.current);

                  console.log("after placesList: ", placesList);
                  console.log("after newTaskList: ", newTaskList);

                  let temp1 = getPlacesList(placesList, newTaskList);

                  props.actions.changePlaces(temp1, dateRef.current);
                  if (temp1.length < 2) setLineLength(0);
                  else if (temp1.length === 2) setLineLength(32);
                  setLoading(false);
                  props.actions.enterApp(dateRef.current);
                })
                .catch((err) => {
                  console.log(err);
                  console.log("1");

                  setLoading(false);
                });
            })
            .catch((err) => {
              console.log(err);
              console.log("2");

              setLoading(false);
            });
        })
        .catch((err) => {
          console.log("3");

          setLoading(false);
        });
    } else {
      if (getFirstItemLocation() + 1 === user_places.user_places.length)
        setLineLength(32);
    }
    return () => { };
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
        <div className="Sites">
          <Navbar origin={"Sites"} user_data={props.user} />

          <div className="containerSites">
            <div className="helloAera">
              <h5 className="helloTitle">,{user.user.hebrewName} שלום</h5>
              <h1 className="addText">!שמחים לראותך</h1>
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
                <Carousel
                  onResize={currentBreakPoint => console.log(currentBreakPoint)}
                  breakPoints={breakPoints}
                  verticalMode
                  initialFirstItem={getFirstItemLocation()}
                  onChange={onChangeSite}
                >
                  {props.user_places.user_places.map((item, index) => {
                    return (
                      <SiteComp
                        key={item.id}
                        id={item.id}
                        name={item.name}
                        imgUrl={
                          item.acf && item.acf.image ? item.acf.image.url : ""
                        }
                        didVisit={
                          isCurrentSite(index) ? "current" : item.didVisit
                        }
                        onImgClick={handleChildImgClick}
                        value={0}
                        audioUrl={
                          item.acf && item.acf.audio ? item.acf.audio.url : ""
                        }
                      />
                    );
                  })}
                </Carousel>
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
