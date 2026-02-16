import React, { useEffect, useRef, useState } from "react";
import NavLink from "./NavLink";
import { isLoggedIn, getUserName, handleLogout } from "../functions";
import "./Navbar.css";
import { StressIconRed, StressIconGrey } from "../assets/icons";
import ListenIcon from "../../images/ListenIcon.png";
import maskable from "../../images/maskable.png";
import { connect } from "react-redux";
import { BsArrowCounterclockwise, BsFillMegaphoneFill, BsThreeDotsVertical } from "react-icons/bs";
import Swal from "sweetalert2";
import { navigate } from "@reach/router";
import { postDataTime } from "../api"; // Ensure this function is imported correctly
import clickSound from '../assets/audio/help_sound.mp3'; // Adjust the path as needed

function Navbar(props) {
  const { origin, user } = props;
  const { hebrewName = "", arabicName = "", imgPath = false } = user;
  const undecodeduserName = localStorage.getItem("undecodeduserName");

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleAudioToggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(clickSound);
      audioRef.current.loop = true; // Loop if you want continuous play
    }
    if (!isPlaying) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    // Listen for network state changes
    const handleOnline = () => {
      const savedData = localStorage.getItem("postDataTime");
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        console.log("Navbar: Sending saved data to the server:", parsedData);

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

  const userName = getUserName() ? getUserName() : "";

  const stress = origin === "Help" ? "StressIconGrey" : "StressIconRed";
  const userId = localStorage.getItem("userID");
  const currentLanguage = sessionStorage.getItem('language');
  const isLTR = () => {
    const currentDirection = sessionStorage.getItem('direction');
    return currentDirection === "ltr"; // Adjust based on your language codes
  };


  return (
    <nav className="navbar my-navbar ">
      <div
        className="NavContent"
        style={{
          direction: isLTR() ? "rtl" : "ltr",
        }}
      >
        <div className="navbar-nav my-navbar-nav mr-auto">
          {/* <li hidden className="nav-item">
							<NavLink to="/">Login</NavLink>
						</li> */}
          {isLoggedIn() ? (
            <React.Fragment>
              <div className="User">
                <div className="navDemo">
                  <div className="nav-item">
                    {
                      // isLTR() && 
                      origin === "Help" ?

                        (
                          <>
                            <div
                              className="GoBackToSitesPage"
                              onClick={() => {
                                console.log("befor audio play");
                                handleAudioToggle();
                                console.log("after audio play");
                                // Swal.fire({
                                //   icon: "question",
                                //   title: "",
                                //   // text: "האם את/ה בטוח/ה שאת/ה רוצה לאפס את המסלול שלך?",
                                //   text: "Are you sure you want to reset your route?",
                                //   // html: `<div>Are you sure you want to reset your route?</div>`,
                                //   showCancelButton: true,
                                //   showDenyButton: false,
                                //   showConfirmButton: true,
                                //   confirmButtonColor: "green",
                                //   cancelButtonColor: "red",
                                //   confirmButtonText: "Yes",
                                //   cancelButtonText: "No",
                                //   focusCancel: false,
                                //   focusConfirm: false,
                                //   customClass: {
                                //     cancelButton: "order-2 right-gap ",
                                //     confirmButton: "order-1",
                                //   },
                                // }).then((result) => {
                                //   if (result.value) {
                                //     // The user clicked the "Confirm" button, perform the desired action
                                //     // window.history.go(-1)
                                //     navigate(`/Sites/${userName}`);
                                //     // window.location.href = `/Sites/${userName}`;
                                //   } else {
                                //     // The user clicked the "Cancel" button, do nothing
                                //   }
                                // });
                                // window.location.href = `/Sites/${userName}`;

                              }}
                            >
                              <BsFillMegaphoneFill
                                style={{
                                  height: "80%",
                                  width: "80%",
                                  marginTop: "0.7vh",
                                }}
                              ></BsFillMegaphoneFill>
                            </div>
                          </>
                          // ) : !isLTR() &&
                          // origin === "Help" ? (
                          // currentLanguage === "Arabic" ? (
                          // <>
                          //   <div
                          //     className="GoBackToSitesPage"
                          //     onClick={() => {
                          //       console.log("go back");
                          //       Swal.fire({
                          //         icon: "question",
                          //         title: "",
                          //         text: "هل أنت متأكد أنك تريد إعادة ضبط مسارك؟",
                          //         showCancelButton: true,
                          //         showDenyButton: false,
                          //         showConfirmButton: true,
                          //         confirmButtonColor: "green",
                          //         cancelButtonColor: "red",
                          //         confirmButtonText: "نعم",
                          //         cancelButtonText: "لا",
                          //         focusCancel: false,
                          //         focusConfirm: false,
                          //         customClass: {
                          //           cancelButton: "order-1 left-gap ",
                          //           confirmButton: "order-2",
                          //         },
                          //       }).then((result) => {
                          //         if (result.value) {
                          //           // The user clicked the "Confirm" button, perform the desired action
                          //           navigate(`/Sites/${userName}`);
                          //           // window.location.href = `/Sites/${userName}`;
                          //         } else {
                          //           // The user clicked the "Cancel" button, do nothing
                          //         }
                          //       });
                          //       // window.location.href = `/Sites/${userName}`;
                          //     }}
                          //   >
                          //     <BsFillMegaphoneFill
                          //       style={{
                          //         height: "80%",
                          //         width: "80%",
                          //         marginTop: "0.7vh",
                          //       }}
                          //     ></BsFillMegaphoneFill>
                          //   </div>
                          // </>
                          // ) : (
                          // <>
                          //   <div
                          //     className="GoBackToSitesPage"
                          //     onClick={() => {
                          //       console.log("go back");
                          //       Swal.fire({
                          //         icon: "question",
                          //         title: "",
                          //         text: "האם את/ה בטוח/ה שאת/ה רוצה לאפס את המסלול שלך?",
                          //         // html: `<div style="direction: rtl">האם את/ה בטוח/ה שאת/ה רוצה לאפס את המסלול שלך?</div>`,

                          //         showCancelButton: true,
                          //         showDenyButton: false,
                          //         showConfirmButton: true,
                          //         confirmButtonColor: "green",
                          //         cancelButtonColor: "red",
                          //         confirmButtonText: "כן",
                          //         cancelButtonText: "לא",
                          //         focusCancel: false,
                          //         focusConfirm: false,
                          //         customClass: {
                          //           cancelButton: "order-1 left-gap ",
                          //           confirmButton: "order-2",
                          //         },
                          //       }).then((result) => {
                          //         if (result.value) {
                          //           // The user clicked the "Confirm" button, perform the desired action
                          //           navigate(`/Sites/${userName}`);
                          //           // window.location.href = `/Sites/${userName}`;
                          //         } else {
                          //           // The user clicked the "Cancel" button, do nothing
                          //         }
                          //       });
                          //       // window.location.href = `/Sites/${userName}`;
                          //     }}
                          //   >
                          //     <BsFillMegaphoneFill
                          //       style={{
                          //         height: "80%",
                          //         width: "80%",
                          //         marginTop: "0.7vh",
                          //       }}
                          //     ></BsFillMegaphoneFill>
                          //   </div>
                          // </>
                          // )
                        ) : (
                          <NavLink origin={origin} onClick={() => {
                            localStorage.setItem("whenAssisted", "0");
                            console.log("testing", localStorage.getItem("whenAssisted"));
                          }} to={`/Help/${userName}`}>
                            <StressIconRed className="StressIcon" src={stress} />
                          </NavLink>
                        )}

                    {/* {origin === "Help" ? (
                      <>
                        <div
                          className="GoBackToSitesPage"
                          onClick={() => {
                            console.log("go back");
                            Swal.fire({
                              icon: "question",
                              title: "",
                              // text: "האם את/ה בטוח/ה שאת/ה רוצה לאפס את המסלול שלך?",
                              html: `<div style="direction: rtl">האם את/ה בטוח/ה שאת/ה רוצה לאפס את המסלול שלך?</div>`,

                              showCancelButton: true,
                              showDenyButton: false,
                              showConfirmButton: true,
                              confirmButtonColor: "green",
                              cancelButtonColor: "red",
                              confirmButtonText: "כן",
                              cancelButtonText: "לא",
                              focusCancel: false,
                              focusConfirm: false,
                              customClass: {
                                cancelButton: "order-1 left-gap ",
                                confirmButton: "order-2",
                              },
                            }).then((result) => {
                              if (result.value) {
                                // The user clicked the "Confirm" button, perform the desired action
                                window.location.href = `/Sites/${userName}`;
                              } else {
                                // The user clicked the "Cancel" button, do nothing
                              }
                            });
                            // window.location.href = `/Sites/${userName}`;
                          }}
                        >
                          <BsArrowCounterclockwise
                            style={{
                              height: "80%",
                              width: "80%",
                              marginTop: "0.7vh",
                            }}
                          ></BsArrowCounterclockwise>
                        </div>
                      </>
                    ) : (
                      <NavLink origin={origin} to={`/Help/${userName}`}>
                        <StressIconRed className="StressIcon" src={stress} />
                      </NavLink>
                    )} */}
                  </div>
                  {/* <div hidden={true} className="nav-item">
                    <NavLink to={`/Sites/${userName}`}>Sites</NavLink>
                  </div> */}
                  {/* <div hidden={true} className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-secondary ml-3"
                    >
                      Logout
                    </button>
                  </div> */}
                </div>
                {origin === "Help" ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "6.5vh",
                      height: "6.5vh",
                    }}
                    onClick={() => {

                      Swal.fire({
                        icon: "question",
                        title: "",
                        // text: "האם את/ה בטוח/ה שאת/ה רוצה לאפס את המסלול שלך?",
                        text: "Are you sure you want to reset your route?",
                        // html: `<div>Are you sure you want to reset your route?</div>`,
                        showCancelButton: true,
                        showDenyButton: false,
                        showConfirmButton: true,
                        confirmButtonColor: "green",
                        cancelButtonColor: "red",
                        confirmButtonText: "Yes",
                        cancelButtonText: "No",
                        focusCancel: false,
                        focusConfirm: false,
                        customClass: {
                          cancelButton: "order-2 right-gap ",
                          confirmButton: "order-1",
                        },
                      }).then((result) => {
                        if (result.value) {
                          // The user clicked the "Confirm" button, perform the desired action
                          navigate(`/Sites/${userName}`);
                        } else {
                          // The user clicked the "Cancel" button, do nothing
                        }
                      });
                    }}>
                    <BsThreeDotsVertical
                      style={{
                        height: "80%",
                        width: "80%",
                        marginTop: "0.7vh",
                      }}
                    ></BsThreeDotsVertical>
                  </div>
                ) : (
                  <>
                  </>
                )}
                <div className="nav-item Profile ProfileContent">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={handleLogout}
                      className="btnlogout btn-secondary ml-3"
                      style={{
                        background: "rgb(37,111,161)",
                        borderWidth: 0,
                        // color: "rgb(37,111,161)",
                      }}
                    >
                      Logout
                    </button>
                    <h5
                      style={{
                        marginLeft: isLTR()
                          ? "14px"
                          : "0px",
                        marginRight: isLTR()
                          ? "0px"
                          : "14px",
                        marginTop: isLTR()
                          ? "7px"
                          : "7px",
                      }}
                    >
                      {undecodeduserName}
                      {/* {userName} */}
                    </h5>
                    {/* <h5>{arabicName , hebrewName}</h5> */}
                  </div>
                </div>
                <div className="imageFrame">
                  {imgPath ? (
                    <img src={imgPath} alt={"LOGO"} />
                  ) : (
                    <img
                      src={maskable}
                      alt={"LOGO"}
                      style={{ width: "110%", height: "110%" }}
                    />
                  )}
                </div>
              </div>
            </React.Fragment >
          ) : (
            <div></div>
          )
          }
        </div >
      </div >
    </nav >
  );
}
const mapStateToProps = (state) => ({ user: state.user.user });
export default connect(mapStateToProps)(Navbar);
