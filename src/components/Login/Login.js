import { Redirect } from "@reach/router";
import axios from "axios";
import React, { useState } from "react";
import Modal from "react-modal";
import clientConfig from "../../client-config";
import "./Login.css";

import { AiFillCloseCircle } from "react-icons/ai";
import { FaRegUser, FaAt } from "react-icons/fa";
import { RiKey2Line } from "react-icons/ri";
import LogoLogin from "../../images/LogoLoginWhite.png";

import wpConfig from "../../wp-config";
import { IS_NODE } from "../Sites/Sites";
import { getingDataUsersFromNodejs, loginUser } from "../api";
import { signIn } from "supertokens-auth-react/recipe/emailpassword";

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


  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const createMarkup = (data) => ({
    __html: data,
  });

  const onFormSubmit = async (event) => {
    event.preventDefault();

    const siteUrl = clientConfig.siteUrl;

    setLoading(true);

    try {
      const signInResponse = await signIn({
        formFields: [{
          id: "email",
          value: "outdate03+student@gmail.com"
        }, {
          id: "password",
          value: "outdate03+student@gmail1"
        }]
      })
      console.log('signInResponse', signInResponse);
      if (signInResponse.status !== "OK") {
        setError("server error. please try again later");
        setLoading(false);
        return;
      }

      const loggedInUser = await loginUser({ user_name: username, phone: password });
      console.log("loggedInUser", loggedInUser);
      if (!loggedInUser) {
        setError("שם משתמש או סיסמה שגויים");
        setLoading(false);
        return;
      }

      console.log(typeof token);

      sessionStorage.setItem("token", loggedInUser.id);
      localStorage.setItem("token", loggedInUser.id);
      localStorage.setItem("userName", username);
      localStorage.setItem("userID", loggedInUser.id);


      // const email = allUsers.some((user) => user.email === userEmail) ? userEmail : "taalworker+121@gmail.com";

      localStorage.setItem("UserNODEid", loggedInUser.id);
      localStorage.setItem("userEmail", loggedInUser.email);

      console.log("res:");
      console.log(res);
      localStorage.setItem("guidphone", loggedInUser.GuidPhone);


      const extraData = loggedInUser2.acf ? loggedInUser.acf : [];
      props.actions.changeUser({
        imgPath: loggedInUser2.picture_url || '',
        username: username,
        isLoggedIn: true,
        id: loggedInUser.id,
        phone: loggedInUser.phone || "",
        arabicName: "",
        guideName: "",
        hebrewName: username,
        GuidPhone: "",
      });

      setUserNiceName(user_nicename);
      setUserEmail(user_email);
      setLoggedIn(true);
    } catch (error) {
      console.error('error', error);
      setError("שם משתמש או סיסמה שגויים");
    }
    setLoading(false);

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
    return <Redirect to={`/Sites/` + user} noThrow />;
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
          <label className="form-group">
            <div className="icon">
              <FaRegUser />
            </div>
            <input
              type="text"
              className="form-control"
              name="username"
              placeholder="שם משתמש اسم المستخدم"
              value={username}
              onChange={handleOnChange}
            />
          </label>
          <br />
          <label hidden={!IS_ADMIN_VERSION} className="form-group">
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
          <br />
          <label className="form-group">
            <div className="icon">
              {" "}
              <RiKey2Line />
            </div>

            <input
              type="password"
              className="form-control"
              name="password"
              placeholder="סיסמא كلمة المرور"
              value={password}
              onChange={handleOnChange}
            />
          </label>
          <br />
          <button className="btn mb-3" type="submit">
            התחברות / دخول{" "}
          </button>

          {/*{ loading && <img className="loader" src={Loader} alt="Loader"/> }*/}
        </form>
        <button
          className="forgotPass"
          onClick={(e) => setIsOpen(true)}
        >
          שכחת סיסמא? نسيت كلمة المرور
        </button>
        <Modal
          isOpen={isOpen}
          onRequestClose={toggleModal}
          style={styles.modalStyle}
        >
          <div className="popup">
            <AiFillCloseCircle id="x" onClick={toggleModal} />
            <div className="ModalMessage">
              <h2>לשחזור סיסמה נא ליצור קשר עם 054-464-3843</h2>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Login;
