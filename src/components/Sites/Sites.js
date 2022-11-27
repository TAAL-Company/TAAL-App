import React, { useState, useEffect, useRef } from "react";
import SiteComp from "./SiteComp.js";
import Carousel, { consts } from "react-elastic-carousel";
import axios from "axios/index";
import BarcodeReader from "./BarcodeReader";
// import BarcodeComp from './BarcodeComp'
import AudioIcon from "../assets/AudioIcon";
import "./Sites.css";
import { isLoggedIn } from "../functions";
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

  const onchange = (scanResult) => {
    if (!(scanResult === "error")) {
      let temp = transformArrayOfObjects(props.user_places.user_places);
      // scan the barcode and compare it with the redux info
      if (placesList.hasOwnProperty(scanResult) || placesList.length === 0) {
        if (temp.hasOwnProperty(scanResult)) {
          let [separateList, cleanList] = extractPathForSite(
            props.user_tasks.user_tasks,
            scanResult,
            trasformObject(props.user_tasks.user_tasks)
          );
          props.actions.visitPlaces(scanResult);
          props.actions.changeCurrentTasks(separateList);
          props.actions.changeCurrentTasksList(cleanList);

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

  const getData = () => {
    const siteUrl = clientConfig.siteUrl;

    get(`${siteUrl}wp-json/wp/v2/users/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
      },
      params: {
        per_page: 99,
        "Cache-Control": "no-cache",
      },
    }).then((res) => {
      console.log("Users:", res);

      //  לא רץ בגלל שיש בעיה בקריאה מה DB
      //  שרה לוי לא מופיעה ב DB
    });
  };

  // try

  const resetFirstTask = () => {};

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
  // checkForInternet()

  useEffect(() => {
    // const userLang = navigator.language || navigator.userLanguage;
    getData();

    resetFirstTask();

    // Update the document title using the browser API once a day
    if (user.user.lastFetchDate !== getDateInfo()) {
      console.log("setLoading1: ", loading);
      setLoading(true);

      console.log("setLoading2: ", loading);
      // get all of the places
      axios
        .get(wpConfig.getPlaces, {
          params: {
            per_page: 70,
            "Cache-Control": "no-cache",
          },
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((places_res) => {
          // setPlacesList(trasformObject(places_res.data))
          placesList = trasformObject(places_res.data);

          // get all of the tasks
          axios
            .get(wpConfig.getTasks, {
              params: {
                per_page: 100,
                "Cache-Control": "no-cache",
              },
            })
            .then((res) => {
              let max_pages = res.headers["x-wp-totalpages"];
              let arrayTemp = [];
              tasksList = res.data;

              if (max_pages > 1) {
                for (let i = 2; i <= max_pages; i++) {
                  axios
                    .get(wpConfig.getTasks, {
                      params: {
                        per_page: 100,
                        page: i,
                        "Cache-Control": "no-cache",
                      },
                    })
                    .then((response) => {
                      // console.log("response.data: ", response.data);

                      Array.prototype.push.apply(tasksList, response.data);
                      taskInformation = trasformObject(tasksList);

                      console.log("taskInformation: ", taskInformation)

                    });
                }
              } else {
                taskInformation = trasformObject(res.data);

                console.log("taskInformation1: ", taskInformation);
              }

              // Get the user's routes
              axios
                .get(wpConfig.getRoutes, {
                  params: {
                    per_page: 70,
                    "Cache-Control": "no-cache",
                  },
                  headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                })
                .then(async (res) => {
                  console.log("maslolim: ", res.data);
                  // setDataRoutes(res.data)
                  routesInfo = transformArrayOfObjects(res.data);
                  console.log("routesInfo: ",routesInfo);

                  let userRoutes = await getUserTasksFromRouteList(
                    res.data,
                    user.user.id
                  );
                  console.log("userRoutes: ", userRoutes);

                  let newTaskList = getTasksList(taskInformation, userRoutes);
                  console.log("after getTasksList: ",newTaskList);

                  newTaskList = addStationDetailsToTask(
                    newTaskList,
                    placesList
                  );

                  props.actions.changeTasks(newTaskList, dateRef.current);

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
    return () => {};
  }, []);
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
      <h1>
        current datetime: {currDate} {currTime}
      </h1>
      {isLoggedIn() ? (
        <div className="Sites">
          <Navbar origin={"Sites"} user_data={props.user} />

          <div className="containerSites">
            <div className="barcode">
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
            </div>
            <div className="sitesBar">
              <div className="sitesBar viewItems">
                <Divider width={screen.width * 0.9} />
                {loading ? <Spinner isLoading={loading} /> : <></>}
                {!loading ? <Connector height={lineLength} /> : <></>}
                <Carousel
                  breakPoints={breakPoints}
                  verticalMode
                  initialFirstItem={getFirstItemLocation()}
                  onChange={onChangeSite}
                >
                  {props.user_places.user_places.map((item, index) => {
                    return (
                      <SiteComp
                        key={item.id}
                        name={item.name}
                        imgUrl={
                          item.acf && item.acf.image ? item.acf.image.url : ""
                        }
                        didVisit={
                          isCurrentSite(index) ? "current" : item.didVisit
                        }
                        onClick={() => console.log(item)}
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
        <div></div>
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
