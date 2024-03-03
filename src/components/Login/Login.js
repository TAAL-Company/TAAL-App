import { Redirect } from "@reach/router";
import axios from "axios";
import React , { useState } from "react";
import Modal from "react-modal";
import clientConfig from "../../client-config";
import "./Login.css";

import { AiFillCloseCircle } from "react-icons/ai";
import { FaRegUser ,FaAt } from "react-icons/fa";
import { RiKey2Line } from "react-icons/ri";
import LogoLogin from "../../images/LogoLoginWhite.png";

import wpConfig from "../../wp-config";
import { IS_NODE } from "../Sites/Sites";
import { getingDataUsersFromNodejs } from "../api";
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

  const onFormSubmit = (event) => {
    event.preventDefault();

    const siteUrl = clientConfig.siteUrl;

    const loginData = {
      username: username,
      password: password,
    };

    setLoading(true);
    axios
      .post(`${siteUrl}wp-json/jwt-auth/v1/token`, loginData)
      .then(async (res) => {
        if (undefined === res.data.token) {
          setError(res.data.message);
          setLoading(false);
          return;
        }

        const { token, user_nicename, user_email, user_ID } = res.data;
        console.log(typeof token);

        sessionStorage.setItem("token", token);
        localStorage.setItem("token", token);
        localStorage.setItem("userName", user_nicename);
        localStorage.setItem("userID", user_ID);

        if (IS_NODE) {
          const allUsers = await getingDataUsersFromNodejs();
          
          const email =  allUsers.some((user) => user.email ===  userEmail) ? userEmail : "taalworker+121@gmail.com";

          const UserNODEid = allUsers.find((user) => {
            if(user.email === email){
              return user
            }else{
              return null 
            }
          });

          localStorage.setItem("UserNODEid", UserNODEid.id);
          console.log("UserNODEid", UserNODEid);

          console.log("userEmail", userEmail,user_email,email);
          console.log("allUsers", allUsers, email);
          localStorage.setItem("userEmail", email);
        }

        axios.get(wpConfig.getUser, {
            headers: {
              Authorization: "Bearer " + token,
            },
          })
          .then((res) => {
            console.log("res:");
            console.log(res);
            localStorage.setItem("guidphone", res.data.acf.guide_phone);


            const extraData = res.data.acf ? res.data.acf : [];
            props.actions.changeUser({
              imgPath:
                extraData.image && extraData.image.url
                  ? extraData.image.url
                  : null,
              username: user_nicename,
              isLoggedIn: true,
              id: user_ID,
              phone: extraData.phone || "",
              arabicName: extraData.arabic_name || "",
              guideName:
                extraData.guide && extraData.guide.display_name
                  ? extraData.guide.display_name
                  : "",
              hebrewName: res.data.name,
              GuidPhone:
                extraData.guide && extraData.guide.user_description
                  ? extraData.guide.user_description
                  : "",
            });

            setLoading(false);
            setUserNiceName(user_nicename);
            setUserEmail(user_email);
            setLoggedIn(true);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => {
        setError(err.response.data.message);
        setLoading(false);
      });
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
          <img alt={"login logo"} src={LogoLogin} style={{maxWidth: "250px"}} />
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
