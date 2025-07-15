import { Redirect } from "@reach/router";
import axios from "axios";
import React, { useState } from "react";
import Modal from "react-modal";
import clientConfig from "../../client-config";
import "./Login.css";

import { AiFillCloseCircle } from "react-icons/ai";
import { FaRegUser, FaAt } from "react-icons/fa";
import { RiKey2Line, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import LogoLogin from "../../images/LogoLoginWhite.png";

import wpConfig from "../../wp-config";
import { IS_NODE } from "../Sites/Sites";
import { getingDataUsersFromNodejs, loginUser } from "../api";
import posthog from "posthog-js";
import { convertUsername } from "../functions";
//redux
// import Spinner from "../assets/Spinner";


const userNameApi = process.env.REACT_APP_USERNAME_ACCESSKEY;
const passwordApi = process.env.REACT_APP_PASSWORD_ACCESSKEY;
const base64encodedData = Buffer.from(`${userNameApi}:${passwordApi}`).toString('base64');

function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userNiceName, setUserNiceName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [IS_ADMIN_VERSION, set_IS_ADMIN_VERSION] = useState(true);

  const [checked, setChecked] = useState({
    Hebrew: true,
    English: false,
    Arabic: false,
  });

  const [passwordLanguage, setpasswordLanguage] = useState('סיסמה');
  const [usernameLanguage, setUsernameLanguage] = useState('שם משתמש');
  const [loginLanguage, setLoginLanguage] = useState('התחברות');
  const [language, setLanguage] = useState('Hebrew');
  const [direction, setDirection] = useState('rtl');
  const [forgotPassmassage, setforgotPassmassage] = useState('לשחזור סיסמה נא ליצור קשר עם 054-464-3843');
  const [errormessage, setErrormessage] = useState('שם משתמש או סיסמה אינם תקנים');

  const handlecheckedChange = (event) => {

    const checkedLanguage = event.target.name;

    sessionStorage.setItem('language', checkedLanguage);

    setChecked({
      Hebrew: checkedLanguage === 'Hebrew',
      English: checkedLanguage === 'English',
      Arabic: checkedLanguage === 'Arabic',
    });

    if (checkedLanguage === 'Hebrew') {
      hebrew();
      setDirection('rtl'); // Set direction to rtl
      sessionStorage.setItem('direction', 'rtl');
      setforgotPassmassage('לשחזור סיסמה נא ליצור קשר עם 054-464-3843');
      setErrormessage('שם משתמש או סיסמה אינם תקנים');
    } else if (checkedLanguage === 'English') {
      english();
      setDirection('ltr'); // Set direction to ltr
      sessionStorage.setItem('direction', 'ltr');
      setforgotPassmassage('To recover your password, please contact 054-464-3843');
      setErrormessage('Username or password are not valid');
    } else if (checkedLanguage === 'Arabic') {
      arabic();
      setDirection('rtl'); // Set direction to rtl
      sessionStorage.setItem('direction', 'rtl');
      setforgotPassmassage(' للحصول على كلمة مرورك، يرجى الاتصال ب 3843-464-054  ');
      setErrormessage('اسم المستخدم او كلمة المرور غير صالحة');
    }
  };

  const { English, Arabic, Hebrew } = checked;

  if(Hebrew) {
    sessionStorage.setItem('direction', direction);
    sessionStorage.setItem('language', language);
  }

  const hebrew = () => {
    setLanguage('hebrew');
    setpasswordLanguage('סיסמה');
    setUsernameLanguage('שם משתמש');
    setLoginLanguage('התחברות');
  };
  const english = () => {
    setLanguage('english');
    setpasswordLanguage('Password');
    setUsernameLanguage('Username');
    setLoginLanguage('Login');
  }

  const arabic = () => {
    setLanguage('arabic');
    setpasswordLanguage('كلمة المرور');
    setUsernameLanguage('اسم المستخدم');
    setLoginLanguage('تسجيل الدخول');
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const createMarkup = (data) => ({
    __html: data,
  });

  const onFormSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    const res = { // wp login
      data: {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvdGFhbC50ZWNoIiwiaWF0IjoxNzEzMzc5MjEzLCJuYmYiOjE3MTMzNzkyMTMsImV4cCI6MTcxNTk3MTIxMywiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMjAifX19.pp1e68ABpbfUT7PKmUHcQQlNE4LR6Hxuf-mygYifUW8",
        "user_email": "ilanimax+801@gmail.com",
        "user_nicename": "sara-levy",
        "user_display_name": "שרה לוי",
        "user_ID": "20",
        "acf": {
          "ID": "20",
          "user_login": "Sara Levy",
          "user_pass": "$P$BeYMG.BS6V.CqLiEWPCDBz0/YwsNE1.",
          "user_nicename": "sara-levy",
          "user_email": "ilanimax+801@gmail.com",
          "user_url": "",
          "user_registered": "2021-07-27 13:46:00",
          "user_activation_key": "",
          "user_status": "0",
          "display_name": "שרה לוי"
        }
      }
    };

    // const loggedInUser = await loginUser({ user_name: username, phone: password });
    const loggedInUser = await loginUser({ user_name: username, password: password });
    if (!loggedInUser) {
      setError(errormessage);
      setLoading(false);
      return;
    }

    // const routesID = loggedInUser.routes.map(route => route.id);
    // localStorage.setItem("routes", JSON.stringify(routesID))

    // const placesID = loggedInUser.sites.map(site => site.id);
    // localStorage.setItem("placesID", JSON.stringify(placesID))

    const loggedInUser2 = {
      "id": "78c4941a-4b31-4b91-a039-5dba27fafbff",
      "user_name": "TW1",
      "email": "taalworker+1@gmail.com",
      "name": "תמר לוי",
      "phone": "1234",
      "picture_url": null,
      "role": "STUDENT",
      "coachId": null,
      "cognitiveProfile": {
        "id": "3594ef80-a0a5-4fbd-9798-2071c5d31b58",
        "remark": null,
        "studentId": "78c4941a-4b31-4b91-a039-5dba27fafbff",
        "value": [],
      },
      "coach": null,
      "routes": [],
      "tasks": [],
      "sites": []
    }

    const { token, user_nicename, user_email, user_ID } = res.data;

    sessionStorage.setItem("token", res.data.token);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userName", convertUsername(loggedInUser.name));
    localStorage.setItem("undecodeduserName", loggedInUser.name); 
    localStorage.setItem("userID", loggedInUser.id);
    // localStorage.setItem("useroacks", loggedInUser.packs);

    if (IS_NODE) {
      // const allUsers = await getingDataUsersFromNodejs();

      const email = loggedInUser.email; // allUsers.some((user) => user.email === userEmail) ? userEmail : "taalworker+121@gmail.com";

      // const UserNODEid = allUsers.find((user) => {
      //   if (user.email === email) {
      //     return user
      //   } else {
      //     return null
      //   }
      // });

      localStorage.setItem("UserNODEid", loggedInUser.id);
      console.log("UserNODEid", loggedInUser.id);
      localStorage.setItem("userEmail", email);
    }

    const res2 = {  // get(wpConfig.getUser
      "id": 20,
      "name": "שרה לוי",
      "url": "",
      "description": "שרה אוהבת לעזור לאנשים",
      "link": "https://taal.tech/author/sara-levy/",
      "slug": "sara-levy",
      "avatar_urls": {
        "24": "https://secure.gravatar.com/avatar/6f9d8abeea86bfda4ddd2c6ce2129f05?s=24&d=mm&r=g",
        "48": "https://secure.gravatar.com/avatar/6f9d8abeea86bfda4ddd2c6ce2129f05?s=48&d=mm&r=g",
        "96": "https://secure.gravatar.com/avatar/6f9d8abeea86bfda4ddd2c6ce2129f05?s=96&d=mm&r=g"
      },
      "meta": [],
      "acf": {
        "arabic_name": "",
        "guide": false,
        "image": false,
        "risk_profile": "10",
        "short_term_memory": "20",
        "middle_term_memory": "11",
        "long_term_memory": "14",
        "concentration_and_focus_in_actions": "12",
        "hearing_level": "41",
        "vision_level": "33",
        "guide_phone": "972544643843"
      },
      "_links": {
        "self": [
          {
            "href": "https://taal.tech/wp-json/wp/v2/users/20"
          }
        ],
        "collection": [
          {
            "href": "https://taal.tech/wp-json/wp/v2/users"
          }
        ]
      }
    }
    console.log("res:");
    console.log(res);
    localStorage.setItem("guidphone", loggedInUser.coach?.phone || res2.acf.guide_phone);

    const extraData = res2.acf ? res2.acf : [];
    console.log("loggedInUser", loggedInUser);

    posthog.identify(loggedInUser.name)
    posthog.capture(
      '$set', 
      { 
          $$set: [process.env.REACT_APP_VERSION],
      }
  )
    
    props.actions.changeUser({
      imgPath: loggedInUser.picture_url || null,
      username: loggedInUser.name || "",
      isLoggedIn: true,
      id: loggedInUser.id,
      phone: loggedInUser.phone || "",
      arabicName: loggedInUser.name || "", //loggedInUser.arabic_name || "",
      guideName: loggedInUser.coach?.name || "", //extraData.guide || "",
      hebrewName: loggedInUser.name || "",// loggedInUser.hebrewName
      guidePhone: loggedInUser.coach?.phone ||  "",
    });

    setLoading(false);
    setUserNiceName(loggedInUser.name);
    setUserEmail(loggedInUser.email);
    setLoggedIn(true);
  };

    const [showPassword, setShowPassword] = useState(false);
  
    const togglePasswordVisibility = () => {
      setShowPassword(prevShowPassword => !prevShowPassword);
    };

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") setUsername(value);
    else if (name === "password") setPassword(value);
    else if (name === "userEmail") setUserEmail(value);
  };

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
  
  const user = userNiceName ? userNiceName : localStorage.getItem("userName");

  if (loggedIn || localStorage.getItem("token")) {
    //if we get the token
    const convertedUsername = convertUsername(user); // Use the function here
    return <Redirect to={`/Sites/` + convertedUsername} noThrow />;
  } else {
    return (
      <div className=" centered">
      
        {/* {loading && <Spinner isLoading={loading} top={-200} />} */}
        {error && (
          <div
            className="alert alert-danger"
            dangerouslySetInnerHTML={createMarkup(error)}
          />
        )}
        <div className="logo">
          <img alt={"login logo"} src={LogoLogin} style={{ maxWidth: "250px" }} />
        </div>
        <form onSubmit={onFormSubmit}>
          <label className="form-group" style={{direction : ` ${direction}`}}>
            <div className="icon">
              <FaRegUser />
            </div>
            <input
              type="text"
              className="form-control"
              name="username"
              placeholder={usernameLanguage}
              value={username}
              onChange={handleOnChange}
            />
          </label>
          <br />
          {/* <label hidden={!IS_ADMIN_VERSION} className="form-group">
            <div className="icon">
              <FaAt />
            </div>
            <input
              type="email"
              className="form-control"
              name="userEmail"
              placeholder="דואר אלקטרוני بريد الكتروني"
              value={userEmail}
              onChange={handleOnChange}
            />
          </label>
          <br /> */}
          <label className="form-group" style={{direction : ` ${direction}`}}>
            <div className="icon">
              {" "}
              <RiKey2Line />
            </div>

            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              name="password"
              placeholder={passwordLanguage}
              value={password}
              onChange={handleOnChange}
            />
            <div className="icon" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
              {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
            </div>
          </label>
          <div className='form-control'>
            <input
              className="forgotPass"
              type="checkbox"
              checked={Hebrew}
              name='Hebrew'
              onClick={(event) => {
                handlecheckedChange(event)
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            Hebrew  |
            <input
              className="forgotPass"
              type="checkbox"
              checked={English}
              name='English'
              onClick={(event) => {
                handlecheckedChange(event)
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            English  |
            <input
              className="forgotPass"
              type="checkbox"
              checked={Arabic}
              name='Arabic'
              onClick={(event) => {
                handlecheckedChange(event)
              }}
              inputProps={{ 'aria-label': 'controlled' }}
            />
           العربية
          </div>
          <br />
          <button className="btn mb-3" type="submit">
            {loginLanguage}
          </button>

          {/*{ loading && <img className="loader" src={Loader} alt="Loader"/> }*/}
        </form>
        <button
          className="forgotPass"
          onClick={(e) => setIsOpen(true)}
        >
          שכחת סיסמא?  /نسيت كلمة المرور / forgotPass?
        </button>
        <Modal
          isOpen={isOpen}
          onRequestClose={toggleModal}
          style={styles.modalStyle}
        >
          <div className="popup">
            <AiFillCloseCircle id="x" onClick={toggleModal} />
            <div className="ModalMessage">
              <h2>{forgotPassmassage}</h2>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Login;
