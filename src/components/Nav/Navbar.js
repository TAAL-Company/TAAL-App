import React from "react";
import NavLink from "./NavLink";
import { isLoggedIn, getUserName } from "../functions";
import "./Navbar.css";
import { StressIconRed, StressIconGrey } from "../assets/icons";
import ListenIcon from "../../images/ListenIcon.png";
import maskable from  "../../images/maskable.png";
import { connect } from "react-redux";
import { BsArrowCounterclockwise } from "react-icons/bs";
import Swal from 'sweetalert2'

function Navbar(props) {
  const { origin, user } = props;
  const { hebrewName = "", arabicName = "", imgPath = false } = user;
  const userName = getUserName() ? getUserName() : "";

  const stress = origin === "Help" ? "StressIconGrey" : "StressIconRed";

  const handleLogout = () => {
    //console.log('logout');
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="navbar my-navbar ">
      <div className="NavContent">
        <div className="navbar-nav my-navbar-nav mr-auto">
          {/* <li hidden className="nav-item">
							<NavLink to="/">Login</NavLink>
						</li> */}
          {isLoggedIn() ? (
            <React.Fragment>
              <div className="User">
                <div className="navDemo">
                  <div className="nav-item">
                    {origin === "Help" ? (
                      <>
                      <div className="GoBackToSitesPage"
                      onClick={() => {
                      console.log("go back");
                      Swal.fire({
                        icon: "warning",
                        title: "",
                        // text: "האם את/ה בטוח/ה שאת/ה רוצה לאפס את המסלול שלך?",
                        html: `<div style="direction: rtl">האם את/ה בטוח/ה שאת/ה רוצה לאפס את המסלול שלך?</div>`,

                        showCancelButton: true,
                        showDenyButton: false,
                        showConfirmButton: true,
                        confirmButtonColor: 'green',
                        cancelButtonColor: 'red',
                        confirmButtonText: 'כן',
                        cancelButtonText: 'לא',
                        focusCancel: false,
                        focusConfirm: false,
                        customClass: {
                          cancelButton: 'order-1 left-gap ',
                          confirmButton: 'order-2',
                        },

                        
                        // onBeforeOpen: () => {
                        //   // Add a style tag to the head element to hide the focus outline
                        //   const head = document.head || document.getElementsByTagName('head')[0];
                        //   const style = document.createElement('style');
                        //   style.type = 'text/css';
                        //   style.innerHTML = 'button:focus { outline: none; }';
                        //   head.appendChild(style);
                        // }

                      }).then((result) => {
                        if (result.value) {
                          // The user clicked the "Confirm" button, perform the desired action
                          window.location.href = `/Sites/${userName}`;
                        } else {
                          // The user clicked the "Cancel" button, do nothing
                        }
                      });
                      // window.location.href = `/Sites/${userName}`;

                    }}>
                        <BsArrowCounterclockwise style={{height: "80%", width: "80%", marginTop: "0.7vh"}}></BsArrowCounterclockwise>
                      </div>
                      </>
                    ) : (
                      <NavLink origin={origin} to={`/Help/${userName}`}>
                        <StressIconRed className="StressIcon" src={stress} />
                      </NavLink>
                    )}
                  </div>
                  <div hidden={true} className="nav-item">
                    <NavLink to={`/Sites/${userName}`}>Sites</NavLink>
                  </div>
                  <div hidden={true} className="nav-item">
                    <button
                      onClick={handleLogout}
                      className="btn btn-secondary ml-3"
                    >
                      Logout
                    </button>
                  </div>
                </div>
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
                      style={{
                        background: "rgb(37,111,161)",
                        borderWidth: 0,
                        color: "rgb(37,111,161)",
                      }}
                    >
                      Logout
                    </button>
                    <h5>{hebrewName}</h5>
                  </div>
                  <h5>{arabicName}</h5>
                </div>
                <div className="imageFrame">
                  {imgPath ? (
                    <img src={imgPath} alt={"LOGO"} />
                    ) : (
                      <img src={maskable} alt={"LOGO"} style={{width: "110%", height: "110%"}} />
                    )}
                </div>
              </div>
            </React.Fragment>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </nav>
  );
}
const mapStateToProps = (state) => ({ user: state.user.user });
export default connect(mapStateToProps)(Navbar);
