import React, { useState, useEffect, useRef, Fragment } from "react";
import TaskComp from "./TaskComp";
import "./Tasks.css";
import Navbar from "../Nav/Navbar.js";
import "regenerator-runtime/runtime.js";
import Modal from "react-modal";
import styled from "styled-components";
import Slider from "react-slick";
import { useSwipeable } from "react-swipeable";
import BackIcon from "../assets/BackIcon";
import { storeInitialData, getLineHeight } from "./functions";
import AudioIcon from "../assets/AudioIcon";
import FinishModal from "./FinishModal";
import BlueArrow from "./BlueArrow";
import { parseContent } from "./functions";
Modal.setAppElement("body");

const initialState = {
  stationsData: {},
};
const tasksReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state };
    default:
      return { ...state };
  }
};

function Tasks(props) {
  const { user_tasks } = props;
  const { current_tasks_list, task_current_index } = user_tasks;
  // const [state, localDispatch] = useReducer(tasksReducer, initialState)

  const getInitialLocation = () => {
    return screen.width > 1020
      ? current_tasks_list.length - 1 - (task_current_index || 0)
      : task_current_index;
  };
  const [currIndex, setCurrIndex] = useState(getInitialLocation);
  const [stationsData, setStationsData] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  // second version
  const [allData, setAllData] = useState([]);
  const sliderRef = useRef();
  const prevIndex = useRef(0);

  const [barStatus2, setBarStatus2] = useState("center bottomBar hide");
  const barStatus = useRef("center bottomBar hide");

  const goBack = () => sliderRef.current.slickPrev();

  const handleSwipe = useSwipeable({
    onSwiped: () => {
      if (screen.width > 1020) {
        if (currIndex === 0) {
          props.actions.completeTask(
            allData[currIndex].id,
            allData.length - 1 - currIndex
          );
          setModalOpen(true);
        } else sliderRef.current.slickGoTo(currIndex - 1);
      } else {
        if (currIndex < allData.length - 1) {
          sliderRef.current.slickNext();
        } else if (currIndex === allData.length - 1) {
          props.actions.completeTask(allData[currIndex].id, currIndex);
          setModalOpen(true);
        }
      }
    },
  });

  const presentFooter = (currentIndex, prevIndex, stations) => {
    if (stations.hasOwnProperty(currIndex)) {
      if (barStatus2 !== "center bottomBar low") {
        barStatus.current = "center bottomBar low";
        setBarStatus2("center bottomBar low");
      }
      return "center bottomBar low";
    } else {
      if (barStatus2 === "center bottomBar low" && currIndex < prevIndex) {
        if (barStatus2 !== "center bottomBar hide") {
          barStatus.current = "center bottomBar hide";
          setBarStatus2("center bottomBar hide");
        }
      } else if (barStatus2 !== "center bottomBar hide") {
        if (barStatus2 !== "center bottomBar up") {
          barStatus.current = "center bottomBar up";
          setBarStatus2("center bottomBar up");
        }
      }
    }
  };

  const markTaskAsFinished = (index) => {
    if (allData[index] && allData[index].id)
      props.actions.completeTask(
        allData[index].id,
        screen.width > 1023 ? allData.length - 1 - index : index
      );
  };
  const updateCurrentTask = (nextIndex) => {
    props.actions.changeCurrentTask(
      allData[nextIndex].title.rendered,
      screen.width > 1023 ? allData.length - 1 - nextIndex : nextIndex
    );
    prevIndex.current = currIndex;
    setCurrIndex(nextIndex);
  };

  // component did mount
  useEffect(() => {
    if (screen.width < 1000 && screen.height) {
      sliderRef.current.slickGoTo(props.user_tasks.task_current_index);
    }
    // setCurrIndex(props.user_tasks.task_current_index)
    let stations = storeInitialData([...props.user_tasks.current_tasks]);
    if (screen.width > 1020)
      setAllData(props.user_tasks.current_tasks_list.slice(0).reverse());
    else setAllData(props.user_tasks.current_tasks_list);
    setStationsData(stations);

    // on unmount
    return () => {};
  }, []);
  /*
        BreakPoints will determine the behavior of our scroll bar according to the size
        * Should fix the trasfer from width 1 to 250
    */
  const settings = {
    className: "carouselContainer",
    centerMode: true,
    vertical: true,
    slidesToScroll: 1,
    verticalSwiping: false,
    slidesToShow: 3,
    speed: 600,
    draggable: false,
    swipe: false,
    centerPadding: 0,
    infinite: false,
    initialSlide: props.user_tasks.task_current_index,
    beforeChange: (current, next) => {
      if (current < next) markTaskAsFinished(current);
      updateCurrentTask(next);
    },
    afterChange: (current, next) => {
      if (barStatus.current == "center bottomBar up") {
        if (barStatus2 !== "center bottomBar hide") {
          barStatus.current = "center bottomBar hide";
          setBarStatus2("center bottomBar hide");
        }
      }
    },
  };
  const ipadSettings = {
    className: "horizontalCarouselContainer",
    infinite: false,
    vertical: false,
    // initial
    speed: 500,
    swipe: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    beforeChange: (current, next) => {
      if (current > next) markTaskAsFinished(current);
      updateCurrentTask(next);
    },
    nextArrow: (
      <BlueArrow
        arrowDirection={"right"}
        visible={allData.length - 1 - currIndex !== 0}
        onClickArrows={(direction) => onClickArrows(direction)}
      />
    ),
    prevArrow: (
      <BlueArrow
        arrowDirection={"left"}
        visible={currIndex !== 0}
        onClickArrows={(direction) => onClickArrows(direction)}
      />
    ),
    initialSlide: getInitialLocation(),
    // initialSlide: props.user_tasks.current_tasks_list.length - 1 - props.user_tasks.task_current_index
  };

  // מעבר למשימה הבאה
  // switch slides with the arrow on tablet
  var dateLastTask = new Date();

  const onClickArrows = (arrowDirection) => {
    // const nameOfTaks = allData[currIndex].title.rendered;
    // var dateCurrTask = new Date();
    // console.log("dateCurrTask: " + dateCurrTask);
    // console.log("dateLastTask: " + dateLastTask);
    // console.log(nameOfTaks);
    console.log(allData[currIndex]);
    if (arrowDirection === "right" && currIndex < allData.length - 1) {
      // start from here
      sliderRef.current.slickGoTo(currIndex + 1);
    }
    //
    else if (arrowDirection === "left" && currIndex !== 0) {
      sliderRef.current.slickGoTo(currIndex - 1);

      // if (dateCurrTask - dateLastTask > 3000) {
      //   // start from here
      //   sliderRef.current.slickGoTo(currIndex - 1);
      //   var dateLastTask = new Date();
      // } else {
      //   console.log("too short time for this task");
      // }
      // console.log("hello");
    }
  };

  // const recognition = new webkitSpeechRecognition();
  // recognition.continuous = true;
  // recognition.lang = "en-US";
  // recognition.interimResults = false;
  // recognition.maxAlternatives = 1;

  // // define when to start the record
  // startBtn.addEventListener("click", () => {
  //   recognition.start();
  // });

  // // Checks for each event whether the defined voice command was received
  // recognition.onresult = (e) => {
  //   let transcript = e.results[e.results.length - 1][0].transcript.trim();
  //   console.log(transcript);
  //   if (transcript === "next" && currIndex < allData.length - 1) {
  //     // pass to next task
  //     console.log("move to next task");
  //     sliderRef.current.slickGoTo(currIndex + 1);
  //   } else if (
  //     (transcript === "back" ||
  //       transcript === "beck" ||
  //       transcript === "buck") &&
  //     currIndex !== 0
  //   ) {
  //     // pass to previous task
  //     console.log("move to previous task");
  //     sliderRef.current.slickGoTo(currIndex - 1);
  //   }
  // };

  // const voiceCommandArrows = (voiceCommand) => {
  //   console.log("Voice Command Here");
  //   if (voiceCommand == "next" && currIndex < allData.length - 1)
  //     sliderRef.current.slickGoTo(currIndex + 1);
  //   else if (voiceCommand == "back" && currIndex !== 0)
  //     sliderRef.current.slickGoTo(currIndex - 1);
  // };

  const resetTasks = () => {
    props.actions.changeCurrentTask(null, null);
  };
  const getLineLength = (sh) => {
    return currIndex === 0 || currIndex === allData.length - 1
      ? 0.5 * sh
      : 0.8 * sh;
  };
  const decideClassName = (index, currIndex) => {
    if (index === currIndex) return "slide activeSlide";
    else if (index === currIndex + 1)
      return presentFooter(currIndex, prevIndex.current, stationsData) ===
        "center bottomBar low"
        ? "slide nextSlide opac"
        : "slide nextSlide";
    else if (index === currIndex - 1) return "slide prevSlide";
    else return "slide inactiveSlide";
  };
  function closeModal() {
    setModalOpen(false);
  }
  const getLargeImage = () => {
    if (allData[currIndex] && allData[currIndex].acf.image.url)
      return allData[currIndex].acf.image.url;
    else
      return "https://globalimpactnetwork.org/wp-content/themes/globalimpact/images/no-image-found-360x250.png";
  };

  // get station name for tablet design
  const getStationName = (index) => {
    if (allData && allData[index] && allData[index].stationDetails)
      return allData[index].stationDetails.name;
    else return "none";
  };

  const onPressGoToSites = () => {
    resetTasks();
  };
  return (
    <div className="Tasks">
      {/* <div className="voicecomman">{const recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // define when to start the record
    startBtn.addEventListener("click", () => {
      recognition.start();
    });

    // Checks for each event whether the defined voice command was received
    recognition.onresult = (e) => {
      let transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log(transcript);
      if (transcript === "next" && currIndex < allData.length - 1) {
        // pass to next task
        console.log("move to next task");
        sliderRef.current.slickGoTo(currIndex + 1);
      } else if (
        (transcript === "back" ||
          transcript === "beck" ||
          transcript === "buck") &&
        currIndex !== 0
      ) {
        // pass to previous task
        console.log("move to previous task");
        sliderRef.current.slickGoTo(currIndex - 1);
      }
    };

    const voiceCommandArrows = (voiceCommand) => {
      console.log("Voice Command Here");
      if (voiceCommand == "go" && currIndex < allData.length - 1)
        sliderRef.current.slickGoTo(currIndex + 1);
      else if (voiceCommand == "back" && currIndex !== 0)
        sliderRef.current.slickGoTo(currIndex - 1);
    };};</div> */}
      <Navbar origin={"Tasks"} user_data={props.user} />
      {screen.width < 1000 ? (
        <div className="containerTasks">
          <div className="center grayBar">
            <Text>
              {allData[currIndex] ? allData[currIndex].stationDetails.name : ""}
            </Text>
          </div>
          <Connector
            height={allData.length < 2 ? 1 : getLineLength(screen.height)}
            top={getLineHeight(currIndex)}
          />

          <div className="center containerCarousel" {...handleSwipe}>
            <Slider {...settings} ref={sliderRef}>
              {allData.map((item, index) => {
                return (
                  <div
                    key={index}
                    className={decideClassName(index, currIndex)}
                  >
                    <TaskComp
                      imgUrl={
                        item.acf && item.acf.image ? item.acf.image.url : false
                      }
                      title={item.title && item.title.rendered.split("&")[0]}
                      content={item.content && item.content.rendered}
                      didFinished={item.didFinish}
                      audioUrl={
                        item.acf && item.acf.audio ? item.acf.audio.url : false
                      }
                      index={index}
                      currentIndex={currIndex}
                      height={screen.height * 0.28}
                    />
                  </div>
                );
              })}
              {/* TODO: fixed carousel problem when having only one task */}
              {<div className="blankBlock"></div>}
              {<div className="blankBlock"></div>}
              {allData.length === 1 && <div className="blankBlock"></div>}
            </Slider>
          </div>

          <PrevButton>
            <BackIcon onClick={goBack} />
          </PrevButton>
          <div className={barStatus2}>
            <Text>
              {stationsData[currIndex] ? stationsData[currIndex].name : ""}
            </Text>
          </div>

          <div>
            <FinishModal
              modalOpen={modalOpen}
              userName={props.username}
              places_location={props.user_places.places_location}
              onPressGoToSites={onPressGoToSites}
            />
          </div>
        </div>
      ) : (
        <div className={"wideContainer"}>
          <div>
            <FinishModal
              modalOpen={modalOpen}
              userName={props.username}
              places_location={props.user_places.places_location}
              wideModal={true}
              onPressGoToSites={onPressGoToSites}
            />
          </div>
          <div className={"wideInfoArea"} {...handleSwipe}>
            <div
              className={"bigImageContainer center"}
              style={{
                backgroundColor:
                  allData[currIndex] && allData[currIndex].didFinish
                    ? "#4CB74C"
                    : "#50595C",
              }}
            >
              <div className={"bigImageWhiteContainer"}>
                <img
                  alt={"big task image"}
                  src={getLargeImage()}
                  style={{ borderRadius: 5 }}
                />
              </div>
            </div>
            <div className={"taskDetailsContainer"}>
              <div className={"detailsTextContainer"}>
                <Text fontSize={4} textAlign={"right"}>
                  {allData[currIndex] &&
                    parseContent(allData[currIndex].title.rendered)}
                </Text>
                <Text fontSize={2.5} textAlign={"right"}>
                  {allData[currIndex] &&
                    parseContent(allData[currIndex].content.rendered)}
                </Text>
              </div>
              <div className={"audioContainer"}>
                <AudioIcon
                  width={25}
                  containerStyle={{ alignSelf: "center" }}
                />
              </div>
            </div>
          </div>
          <div className={"wideSliderArea"}>
            <div
              style={{
                opacity: stationsData.hasOwnProperty(
                  allData.length - 1 - currIndex
                )
                  ? "1"
                  : "0",
              }}
              className={"stationBox gray"}
            >
              <Text
                className={"stationText left"}
                textAlign={"left"}
                fontSize={2}
              >
                :התחנה הבאה {getStationName(currIndex - 1)}
              </Text>
              <div className={"stationLogo"}>
                <Text fontSize={2}>לוגו</Text>
              </div>
            </div>
            <Slider {...ipadSettings} ref={sliderRef}>
              {<div className="blankBlock"></div>}
              {<div className="blankBlock"></div>}
              {allData.map((item, index) => {
                return (
                  <div key={index} className={"slide slideHorizontalItem"}>
                    <TaskComp
                      imgUrl={
                        item.acf && item.acf.image ? item.acf.image.url : false
                      }
                      title={item.title && item.title.rendered.split("&")[0]}
                      content={item.content && item.content.rendered}
                      didFinished={item.didFinish}
                      audioUrl={
                        item.acf && item.acf.audio ? item.acf.audio.url : false
                      }
                      index={index}
                      currentIndex={currIndex}
                      height={screen.height * 0.2}
                      wideCaro={100}
                      width={100}
                      wrapperWidth={80}
                    />
                  </div>
                );
              })}
              {/* TODO: fixed carousel problem when having only one task */}
            </Slider>
            <div className={"stationBox"}>
              <Text
                className={"stationText right"}
                textAlign={"right"}
                fontSize={2}
              >
                {getStationName(currIndex)}
              </Text>
              <div className={"stationLogo"}>
                <Text fontSize={2}>לוגו</Text>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  barTextStyle: {
    fontSize: 22,
    marginTop: "3%",
    textAlign: "center",
    color: "white",
  },
  modalStyle: {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.70)",
      zIndex: 1000,
    },
    content: {
      position: "unset",
      width: "90%",
      height: "50%",
      backgroundColor: "rgb(80, 89, 92)",
      WebkitOverflowScrolling: "touch",
      borderRadius: "1%",
      alignSelf: "center",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "50%",
      borderColor: "green",
      padding: "0px",
    },
  },
};

export default Tasks;

const InfoBox = styled.div`
  width: 50%;
  height: ${(props) => (props.height ? props.height : 250)}px;
  border-color: ${(props) => (props.borderColor ? props.borderColor : "black")};
  border-radius: 2%;
  border-style: solid;
  border-width: 6px;
  display: flex;
  flex-direction: column;
`;

const Connector = styled.hr`
  background-color: #aab1b1;
  position: ${(props) => (props.position ? props.position : "absolute")};
  width: 2px;
  margin: 0;
  height: ${(props) => (props.height ? props.height : 0)}px;
  left: 50vw;
  bottom: 28vh;
  top: ${(props) => (props.top ? props.top : 24)}vh;
  z-index: 0;
`;

const Text = styled.p`
  color: white;
  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : 6)}vw;
  font-family: "Arimo";
  margin: 0;
`;

const PrevButton = styled.div`
  height: 15vw;
  width: 15vw;
  position: absolute;
  bottom: 4vh;
  left: 5vw;
  z-index: 100;
`;

const LogoIconWrapper = styled.div`
  width: 18%;
`;
