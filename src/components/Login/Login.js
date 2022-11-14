import React from "react";
import { Redirect } from "@reach/router";
import axios from "axios";
import clientConfig from "../../client-config";
import "./Login.css";
import Modal from "react-modal";

// import LogoLogin from "../../images/logoLogin.png";
import { FaRegUser } from "react-icons/fa";
import { RiKey2Line } from "react-icons/ri";
import { AiFillCloseCircle } from "react-icons/ai";

import wpConfig from "../../wp-config";
//redux
import { connect, Provider } from "react-redux";
import { bindActionCreators } from "redux";
import configureStore from "../../store/configureStore";
import Spinner from "../assets/Spinner";

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      userNiceName: "",
      userEmail: "",
      loggedIn: false,
      loading: false,
      error: "",
      isOpen: false,
    };
  }

  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };

  createMarkup = (data) => ({
    __html: data,
  });

  onFormSubmit = (event) => {
    event.preventDefault();

    const siteUrl = clientConfig.siteUrl;

    const loginData = {
      username: this.state.username,
      password: this.state.password,
    };

    this.setState({ loading: true }, () => {
      axios
        .post(`${siteUrl}wp-json/jwt-auth/v1/token`, loginData)
        .then((res) => {
          if (undefined === res.data.token) {
            this.setState({ error: res.data.message, loading: false });
            return;
          }

          const { token, user_nicename, user_email, user_ID } = res.data;
          console.log(typeof token);

          // axios.post(`${siteUrl}/wp-json/jwt-auth/v1/token`)
          sessionStorage.setItem("token", token);
          localStorage.setItem("token", token);
          localStorage.setItem("userName", user_nicename);

          // get user acf fields
          axios
            .get(wpConfig.getUser, {
              headers: {
                Authorization: "Bearer " + token,
              },
            })
            .then((res) => {
              console.log("res:");
              console.log(res);
              const extraData = res.data.acf ? res.data.acf : [];
              this.props.actions.changeUser({
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

              this.setState({
                loading: false,
                token: token,
                userNiceName: user_nicename,
                userEmail: user_email,
                loggedIn: true,
              });
            })
            .catch((err) => console.error(err));
        })
        .catch((err) => {
          this.setState({ error: err.response.data.message, loading: false });
        });
    });
  };

  handleOnChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  styles = {
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
  render() {
    const { username, password, userNiceName, loggedIn, error, loading } =
      this.state;

    const user = userNiceName ? userNiceName : localStorage.getItem("userName");

    if (loggedIn || localStorage.getItem("token")) {
      //if we get the token
      return <Redirect to={`/Sites/` + user} noThrow />;
    } else {
      return (
        <div className=" centered">
          {loading && <Spinner isLoading={loading} top={-200} />}
          {error && (
            <div
              className="alert alert-danger"
              dangerouslySetInnerHTML={this.createMarkup(error)}
            />
          )}
          <div className="logo">
            {/* <img alt={"login logo"} src={LogoLogin} /> */}
          </div>
          <form onSubmit={this.onFormSubmit}>
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
                onChange={this.handleOnChange}
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
                onChange={this.handleOnChange}
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
            onClick={(e) => this.setState({ isOpen: true })}
          >
            שכחת סיסמא? نسيت كلمة المرور
          </button>
          <Modal
            isOpen={this.state.isOpen}
            onRequestClose={this.toggleModal}
            style={this.styles.modalStyle}
          >
            <div className="popup">
              <AiFillCloseCircle id="x" onClick={this.toggleModal} />
              <div className="ModalMessage">
                <h2>לשחזור סיסמה נא ליצור קשר עם 054-464-3843</h2>
              </div>
            </div>
          </Modal>
        </div>
      );
    }
  }
}

export default Login;
