import React, { Children, Fragment, useEffect, useState } from "react";
import Modal from "react-modal";

import { AiFillCloseCircle } from "react-icons/ai";
import { BsArrowCounterclockwise } from "react-icons/bs";
import { FaHandHolding } from "react-icons/fa";

import "./HelpPage.css";
import Navbar from "../Nav/Navbar";
import { isLoggedIn, getUserName } from "../functions";
import AudioIcon from "../assets/AudioIcon";
import logo from "../../images/logo.png";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

import axios from "axios";
import wpConfig from "../../wp-config";
import clientConfig from "../../client-config";

function Help(props) {
  const { user_tasks, user_places, user } = props;
  const currentTaskName = user_tasks.task_location || "";
  const [isOpen, setIsOpen] = useState(false);
  const [action, setAction] = useState("");
  const [state, setState] = useState({
    action: "",
    site: "",
  });

  console.log("user_places.places_location: " + user_places.places_location);
  console.log("len: " + user_places.user_places.length);
  console.log("task_location: " + user_tasks.task_location);
  console.log("user_places: " + user_places.user_places);
  console.log("username hebrew" + user.user.hebrewName);
  console.log("current task: " + currentTaskName);

  const [phoneGuide, setPhoneGuide] = useState("error");

  const { t } = useTranslation();

  useEffect(() => {
    Modal.setAppElement("body");
    checkTask();
    return () => {};
  }, []);

  const toggleModal = () => {
    //   setIsOpen(!isOpen) - cancel modal ?
  };
  const checkTask = () => {
    // check if the user have current task
  };

  const changeHelpText = () => {
    if (
      user_tasks.task_location !== null &&
      user_places.places_location !== -1
    ) {
      setState({
        ...state,
      });
    } else if (user_tasks.task_location === -1) {
      setState({
        ...state,
        action: "",
        site: "סיימת את כל המשימות במסלול שלך להיום",
      });
    } else {
      if (user_places.user_places.length === 1) {
        setState({
          ...state,
        });
      } else {
        setState({
          ...state,
          action: "המיקום הבא שלי:",
          site: user_places.user_places[user_places.places_location].name,
        });
      }
    }
  };
  useEffect(() => {
    console.log("user:");
    getData();
    changeHelpText();
  }, []);

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
      // 06.11.2022

      console.log(user.user.id);
      const userId = user.user.id;

      const result = res.filter((user) => user.id == userId);

      // commit and pushing
      console.log(result);

      // change to result[0].phone
      const phone = result[0].acf.guide_phone;

      console.log("phone: " + phone);

      // set is not working
      setPhoneGuide(phone);
    });
  };

  return (
    <Fragment>
      {isLoggedIn() ? (
        <div className="Help">
          <Navbar origin={"Help"} user_data={user} />
          <div className="content-wrap">
            <div className="helpContact">
              <div className="MobileMode">
                <div className="ContentWithLogo">
                  <div className="helpMe">
                    <div className="scText">
                      <b>בבקשה,</b>
                    </div>
                    <div className="scText">
                      <b id="Tablet">أحتاج</b>
                    </div>
                    <div className="thanks">
                      <div id="intro">התקשיתי במילוי המשימות שלי.</div>
                      <div id="intro">אשמח לסיוע ותודה על הרצון לעזור</div>
                      <div id="intro" className="Tablet">
                        لو سمحت، أنا أواجه صعوبة في أداء مهماتي ، ارجو أن
                        تساعدني مشكورا
                      </div>
                    </div>
                  </div>

                  <div className="listenContact">
                    <div className="audioCircle">
                      <AudioIcon
                        id="audio"
                        onPress={() => console.log("pressed audio")}
                      />
                    </div>
                  </div>
                </div>
                <div className="Icon">
                  <img src={logo} />
                </div>
              </div>
              <div className="content">
                <div className="instructionArea">
                  <div className="textArea">
                    <div className="headText">{state.action}</div>
                    <h2 className="secText">{state.site}</h2>

                    <Fragment>
                      <div className="headText" hidden={currentTaskName === ""}>
                        המשימה הנוכחית שלי:
                      </div>
                      <h2 className="secText" hidden={currentTaskName === ""}>
                        {currentTaskName}
                      </h2>
                    </Fragment>
                  </div>
                  <div className="listen">
                    <AudioIcon
                      id="audio"
                      onPress={() => console.log("pressed audio")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer">
            <div className="row">
              <div className="HelpButton">
                {/* # In JS/HTML
                    # const phoneNumber = (input from DB)
                    # const msg = "התקשיתי במילוי המשימות שלי. אשמח לסיוע ותודה על הרצון לעזור"

                    # const link = ('https://wa.me/' + phoneNumber + "?text=" + msg + "&amp;app_absent=0");
                    # <a href=link>{ICON גלגל הצלה}</a> */}
                <a
                  href={
                    phoneGuide !== ""
                      ? "https://api.whatsapp.com/send/?phone=" +
                        phoneGuide.toString() +
                        "&text=" +
                        user.user.hebrewName.toString() +
                        " מתקשה במילוי המשימה " +
                        '"' +
                        currentTaskName.toString() +
                        '"' +
                        "," +
                        " " +
                        "אשמח לסיוע ותודה על הרצון לעזור" +
                        "." +
                        "&type=phone_number&app_absent=0"
                      : // "&text=%D7%94%D7%AA%D7%A7%D7%A9%D7%99%D7%AA%D7%99+%D7%91%D7%9E%D7%99%D7%9C%D7%95%D7%99+%D7%94%D7%9E%D7%A9%D7%99%D7%9E%D7%95%D7%AA+%D7%A9%D7%9C%D7%99.+%D7%90%D7%A9%D7%9E%D7%97+%D7%9C%D7%A1%D7%99%D7%95%D7%A2+%D7%95%D7%AA%D7%95%D7%93%D7%94+%D7%A2%D7%9C+%D7%94%D7%A8%D7%A6%D7%95%D7%9F+%D7%9C%D7%A2%D7%96%D7%95%D7%A8&type=phone_number&app_absent=0"
                        // "https://wa.me/" +
                        //   phoneGuide +
                        //   "?text=" +
                        //   "התקשיתי במילוי המשימות שלי. אשמח לסיוע ותודה על הרצון לעזור" +
                        //   "&amp;app_absent=0"
                        "Error Phone doesn't exists"
                  }
                >
                  <button className="helpNow" onClick={toggleModal}>
                    <div className="tabletButton">
                      <div className="iconD">
                        <FaHandHolding />
                      </div>
                      <div className="vertical">
                        <div className="text">ממשיך לבקש עזרה</div>
                        <div className="text Tablet">مستمر في طلب المساعدة</div>
                      </div>
                    </div>
                  </button>
                </a>
                <Modal
                  isOpen={isOpen}
                  onRequestClose={toggleModal}
                  style={styles.modalStyle}
                >
                  <div className="popup">
                    <AiFillCloseCircle id="x" onClick={toggleModal} />
                    <div className="ModalMessage">
                      {user.user.hebrewName + " " + "זקוק/ה לסיוע."}
                      <br />
                      {"נשלחה הודעה למסייע/ת" + " " + user.user.guideName + "."}
                      <br />
                      {"בטלפון" + " " + user.user.GuidPhone}
                      <a href={"tel://" + user.user.GuidPhone}>
                        {user.user.GuidPhone}
                      </a>
                      <br />
                      {"ניתן ליצור קשר עם" +
                        " " +
                        user.user.guideName +
                        " " +
                        "לקבלת הנחיות סיוע עד להגעתו/ה"}
                      <br />
                      {"תודה על עזרתכם.."}
                    </div>
                  </div>
                </Modal>
              </div>
              <div className="HelpButton">
                <button
                  onClick={() => window.history.go(-1)}
                  className="return"
                >
                  <div className="tabletButton">
                    <div className="iconD">
                      <BsArrowCounterclockwise />
                    </div>
                    <div className="vertical">
                      <div className="text">חזור למשימות שלי</div>
                      <div className="text Tablet">العودة إلى مهماتي</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </Fragment>
  );
}

const styles = {
  modalStyle: {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
    },
    content: {
      width: "80%",
      height: "80%",
      WebkitOverflowScrolling: "touch",
      border: "1px solid #ccc",
      borderRadius: "1%",
    },
  },
};

export default Help;
