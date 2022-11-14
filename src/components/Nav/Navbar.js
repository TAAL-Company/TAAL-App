import React from "react";
import NavLink from "./NavLink";
import { isLoggedIn, getUserName } from "../functions";
import "./Navbar.css";
import { StressIconRed, StressIconGrey } from "../assets/icons";
import ListenIcon from "../../images/ListenIcon.png";
import { connect } from "react-redux";

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
                      <StressIconGrey className="StressIcon nav-link linker" />
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
                  <img src={imgPath} alt={"image frame"} />
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
