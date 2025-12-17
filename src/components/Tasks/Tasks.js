import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import Slider from "react-slick";
import { useSwipeable } from "react-swipeable";
import "regenerator-runtime/runtime.js";
import styled from "styled-components";
import Navbar from "../Nav/Navbar.js";
import AudioIcon from "../assets/AudioIcon";
import BackIcon from "../assets/BackIcon";
import { handleLogout, isLoggedIn } from "../functions";
import BlueArrow from "./BlueArrow";
import FinishModal from "./FinishModal";
import TaskComp from "./TaskComp";
import "./Tasks.css";
import { getLineHeight, parseContent, storeInitialData } from "./functions";
import Swal from "sweetalert2";

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
  // console.log("Tasks props: ", props);
  let screenwidth = 672;//1020 - 1023

  const { user_tasks } = props;
  const { current_tasks_list, task_current_index } = user_tasks;
  // const [state, localDispatch] = useReducer(tasksReducer, initialState)
  const { task_location } = user_tasks;


  const getInitialLocation = () => {
    return screen.width > screenwidth
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

  const [canSwipe, setCanSwipe] = useState(false);
  const [Swipetime, setSwipetime] = useState(0);
  const [waitingmsg, Setwaitingmsg] = useState('הזמן לא נגמר...');
  // Loop countdown state (for loopDuration)
  const [loopIdActive, setLoopIdActive] = useState(null);
  const loopEndTsRef = useRef(null);
  const loopTickerRef = useRef(null);
  const [loopRemainingSec, setLoopRemainingSec] = useState(null);

    useEffect(() => {
      const currentLanguage = sessionStorage.getItem('language')
      if (currentLanguage === 'Hebrew') {
        Setwaitingmsg('הזמן לא נגמר...');
      } else if (currentLanguage === 'English') {
        Setwaitingmsg('Waiting...');
      } else if (currentLanguage === 'Arabic') {
        Setwaitingmsg('انتظر...');
      }
  }, []);

  // useEffect(() => {
  //   if (screen.width > screenwidth)
  //     setAllData(props.user_tasks.current_tasks_list.slice(0).reverse());
  //   else setAllData(props.user_tasks.current_tasks_list);

  //   console.log("currIndex", allData);
  // }, []);

  useEffect(() => {
    setCanSwipe(false);
    setSwipetime(Date.now());
    let estimatedTime = allData[currIndex]?.acf?.Estimated_time;
    if (estimatedTime == undefined) {
        if (screen.width > screenwidth)
          estimatedTime =props.user_tasks.current_tasks_list.slice(0).reverse()[currIndex]?.acf?.Estimated_time;
        else estimatedTime = props.user_tasks.current_tasks_list[currIndex]?.acf?.Estimated_time;
    }

    // console.log("currIndex", props.user_tasks.current_tasks_list.slice(0).reverse());
    // console.log("currIndex", props.user_tasks.current_tasks_list);
    // console.log("currIndex", currIndex);
    // console.log("currIndex estimatedTime", estimatedTime);

    const timeoutID = setTimeout(() => {
      setCanSwipe(true);
    }, estimatedTime * 1000); // Convert seconds to milliseconds
    return () => clearTimeout(timeoutID);
  }, [currIndex]);

  // Start/stop loop countdown when entering/leaving a duration-based loop
  useEffect(() => {
    const meta = allData[currIndex]?.loopMeta;
    const hasDuration = meta && meta.loopDuration != null && meta.loopDuration !== '' && !isNaN(meta.loopDuration);
    if (hasDuration) {
      if (loopIdActive !== meta.loopId) {
        // Entering a new loop or switching loops: start countdown if not already running for this loop
        const endTs = Date.now() + Number(meta.loopDuration) * 60 * 1000;
        loopEndTsRef.current = endTs;
        setLoopIdActive(meta.loopId);
        setLoopRemainingSec(Math.ceil((endTs - Date.now()) / 1000));
        if (loopTickerRef.current) clearInterval(loopTickerRef.current);
        loopTickerRef.current = setInterval(() => {
          const rem = Math.ceil((loopEndTsRef.current - Date.now()) / 1000);
          setLoopRemainingSec(rem > 0 ? rem : 0);
          if (rem <= 0) {
            clearInterval(loopTickerRef.current);
            loopTickerRef.current = null;
            // Time's up: skip to the first task after this loop
            endCurrentLoop(meta.loopId);
          }
        }, 500);
      }
    } else {
      // Not inside a duration-based loop: clear if we were showing one
      if (loopTickerRef.current) {
        clearInterval(loopTickerRef.current);
        loopTickerRef.current = null;
      }
      loopEndTsRef.current = null;
      setLoopRemainingSec(null);
      setLoopIdActive(null);
    }
    return () => {};
  }, [currIndex, allData]);

  const endCurrentLoop = (activeLoopId) => {
    if (!activeLoopId) return;
    // find last index of this loop in allData
    let lastIdx = -1;
    for (let i = allData.length - 1; i >= 0; i--) {
      if (allData[i]?.loopMeta?.loopId === activeLoopId) {
        lastIdx = i;
        break;
      }
    }
    const target = lastIdx >= 0 ? lastIdx + 1 : currIndex + 1;
    if (sliderRef.current && target < allData.length) {
      sliderRef.current.slickGoTo(target);
    } else if (target >= allData.length) {
      // we're at the end; trigger completion if needed
      if (screen.width <= screenwidth) {
        // mobile flow: mark final task
        if (allData[currIndex]) {
          props.actions.completeTask(allData[currIndex].id, currIndex);
          setModalOpen(true);
        }
      }
    }
  };

  const handleSwipe = useSwipeable({
    onSwiped: () => {
      const estimatedTime = allData[currIndex]?.acf?.Estimated_time;
      console.log('Swipetime', Swipetime / 1000, Date.now() / 1000 - Swipetime / 1000, estimatedTime - (Date.now() / 1000 - Swipetime / 1000));
      if (canSwipe) {
        if (screen.width > screenwidth) {
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
      } else {
        let timerInterval;
        Swal.fire({
          title: waitingmsg,
          width: 600,
          html: `<p>הזמן נגמר ב ${(estimatedTime - (Date.now() / 1000 - Swipetime / 1000)).toFixed(2)} שניות</p>`,
          icon: "warning",
          padding: "3em",
          color: "#000000",
          showConfirmButton: false,
          timer: 1500,
          backdrop: `
          rgba(255, 193, 91,0.4)
          no-repeat
        `,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        });
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
        screen.width > screenwidth ? allData.length - 1 - index : index
      );
  };
  const updateCurrentTask = (nextIndex) => {
    props.actions.changeCurrentTask(
      allData[nextIndex].title.rendered,
      screen.width > screenwidth ? allData.length - 1 - nextIndex : nextIndex
    );
    prevIndex.current = currIndex;
    setCurrIndex(nextIndex);
  };

  // component did mount
  useEffect(() => {
    if (!isLoggedIn()) {
      handleLogout();
    }


    if (screen.width < screenwidth && screen.height) {
      sliderRef.current.slickGoTo(props.user_tasks.task_current_index);
    }
    // setCurrIndex(props.user_tasks.task_current_index)
    let stations = storeInitialData([...props.user_tasks.current_tasks]);
    if (screen.width > screenwidth)
      setAllData(props.user_tasks.current_tasks_list.slice(0).reverse());
    else setAllData(props.user_tasks.current_tasks_list);
    setStationsData(stations);

    // on unmount
    return () => { };
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
      const estimatedTime = allData[currIndex]?.acf?.Estimated_time;
      console.log('Swipetime', Swipetime / 1000, Date.now() / 1000 - Swipetime / 1000, estimatedTime - (Date.now() / 1000 - Swipetime / 1000));
      if (canSwipe) {
        sliderRef.current.slickGoTo(currIndex - 1);
      } else {
        let timerInterval;
        Swal.fire({
          title: waitingmsg,
          width: 600,
          html: `<p>הזמן נגמר ב ${(estimatedTime - (Date.now() / 1000 - Swipetime / 1000)).toFixed(2)} שניות</p>`,
          icon: "warning",
          padding: "3em",
          color: "#000000",
          showConfirmButton: false,
          timer: 1500,
          backdrop: `
        rgba(255, 193, 91,0.4)
        no-repeat
      `,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        });
      }
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
      // return "https://planner.taal.link/static/media/TaskImage.3014df9eff903a04f142.png";
  };

  const getAudio = () => {
    console.log("allData[currIndex]", allData[currIndex]?.acf?.audio?.url);
    if (allData[currIndex] && allData[currIndex].acf.image.url)
      return allData[currIndex].acf.audio.url;
    else
      return "null";
  };

  // get station name for tablet design
  const getStationName = (index) => {
    if (allData && allData[index] && allData[index].stationDetails)
      return allData[index].stationDetails.title;
    else return "none";
  };

  const onPressGoToSites = () => {
    resetTasks();
  };

  const renderLoopMeta = () => {
    const meta = allData[currIndex]?.loopMeta;
    if (!meta) return null;
    const chips = [];
    // Duration chip (orange) with countdown
    if (meta.loopDuration != null && meta.loopDuration !== "") {
      let label = `משך חזרה: ${meta.loopDuration} דק'`;
      if (loopIdActive === meta.loopId && loopRemainingSec != null) {
        const mm = Math.floor(loopRemainingSec / 60);
        const ss = loopRemainingSec % 60;
        label += ` · נותר: ${mm}:${ss < 10 ? '0' + ss : ss}`;
      }
      chips.push(
        <Badge key="duration" bg="#FFA726">{label}</Badge>
      );
    }
    // Iteration chip (blue)
    if (meta.loopIteration != null && meta.loopIteration !== "") {
      chips.push(
        <Badge key="iteration" bg="#42A5F5">{`מס' חזרות: ${meta.iterationIndex}/${meta.iterationCount}`}</Badge>
      );
    }
    // Until chip (purple)
    if (meta.loopUntil) {
      chips.push(
        <Badge key="until" bg="#AB47BC">{`עד: ${meta.loopUntil}`}</Badge>
      );
    }
    if (chips.length === 0) return null;
    return <BadgesRow>
      {chips}
      </BadgesRow>;
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
      {screen.width < screenwidth ? (
        <div className="containerTasks">
          <div className="center grayBar">
            <StationHeader>
              <Text>
                {/* {allData[currIndex] && allData[currIndex].stationDetails ? allData[currIndex].stationDetails.name : ""} */}
                {allData[currIndex]?.stationDetails?.title || ''}
              </Text>
              {renderLoopMeta()}
            </StationHeader>
          </div>
          <Connector
            height={allData.length < 2 ? 1 : getLineLength(screen.height)}
            top={getLineHeight(currIndex)}
          />

          <div className="center containerCarousel" {...handleSwipe}>
            <Slider {...settings} ref={sliderRef}>
              {allData.map((item, index) => {
                // console.log("item", item);
                return (
                  <div
                    key={index}
                    className={decideClassName(index, currIndex)}
                  >
                    <TaskComp
                      taskId={item.id}
                      task_location={task_location}
                      loopMeta={item.loopMeta}
                      stationId={item.loopMeta?.stationId || item.stationDetails?.id || item.stationDetails?.ID}
                      dataEntered={item.template}
                      taskType={item.type}
                      dataEntryType={item.status}
                      dataEntryValidation={item.featured_media}
                      lastOne={modalOpen}
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
                      height={window.innerHeight * 0.28}
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
              {stationsData[currIndex] ? stationsData[currIndex].title : ""}
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
                  audioUrl={
                    getAudio()
                  }
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
                      taskId={item.id}
                      task_location={task_location}
                      loopMeta={item.loopMeta}
                      stationId={item.loopMeta?.stationId || item.stationDetails?.id || item.stationDetails?.ID}
                      dataEntered={item.template}
                      taskType={item.type}
                      dataEntryType={item.status}
                      dataEntryValidation={item.featured_media}
                      lastOne={modalOpen}
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
              <StationHeaderintabletview>
                <Text
                  className={"stationText right"}
                  textAlign={"right"}
                  fontSize={2}
                >
                  {getStationName(currIndex)}
                </Text>
                {renderLoopMeta()}
              </StationHeaderintabletview>
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
  border-color: ${(props) => (props.borderColor ? props.borderColor : "#272727")};
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

// Colored badges for LoopMeta under station name
const BadgesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-top: 6px;
`;

const Badge = styled.span`
  background: ${(p) => p.bg || "#607D8B"};
  color: #fff;
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 3vw;
  line-height: 1;
  display: inline-block;
  white-space: nowrap;
`;

const StationHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StationHeaderintabletview = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  ${Badge} {
    font-size: 2vw;
  }
`;
