import { navigate, Redirect } from "@reach/router";
import axios from "axios";
import React, { useState } from "react";
import Modal from "react-modal";
import BarcodeComp from '../Sites/BarcodeComp';
import clientConfig from "../../client-config";
import "./Login.css";

import { AiFillCloseCircle } from "react-icons/ai";
import { FaRegUser, FaAt } from "react-icons/fa";
import { RiKey2Line, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';
import LogoLogin from "../../images/LogoLoginWhite.png";

import wpConfig from "../../wp-config";
import { IS_NODE } from "../Sites/Sites";
import { getingDataUsersFromNodejs, loginUser } from "../api";
import { getingDataTasksByIdsFromNodejs, getingDataRouteByIdsFromNodejs, getingDataRouteByIdFromNodejs } from "../api";
import { expandRouteTasksWithLoops, extractPathForSiteWithLoops, addStationDetailsToTask } from "../Sites/functions";
import posthog from "posthog-js";
import { convertUsername } from "../functions";
import { useTranslator } from "../../Utility/TranslationProvider";
//redux
// import Spinner from "../assets/Spinner";


const userNameApi = process.env.REACT_APP_USERNAME_ACCESSKEY;
const passwordApi = process.env.REACT_APP_PASSWORD_ACCESSKEY;
const base64encodedData = Buffer.from(`${userNameApi}:${passwordApi}`).toString('base64');

function DataLanguageSwitcher() {
  const { currentLanguage, setLanguage, showOriginal, setShowOriginal } = useTranslator();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
      <select
        value={currentLanguage}
        onChange={(e) => setLanguage(e.target.value)}
        className="data-language-switcher"
        style={{
          padding: '8px 12px',
          fontSize: '16px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          backgroundColor: '#fff',
          cursor: 'pointer',
          marginTop: '10px',
          width: '200px'
        }}
      >
        <option value="en">English</option>
        <option value="he">עברית</option>
        <option value="ar">العربية</option>
      </select>
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        cursor: 'pointer'
      }}>
        <input
          type="checkbox"
          checked={showOriginal}
          onChange={(e) => setShowOriginal(e.target.checked)}
          style={{ cursor: 'pointer' }}
        />
        Show Original Text (No Translation)
      </label>
    </div>
  );
}

function Login(props) {
  const { setLanguage: setDataLanguage, showOriginal, setShowOriginal } = useTranslator();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userNiceName, setUserNiceName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [IS_ADMIN_VERSION, set_IS_ADMIN_VERSION] = useState(true);

  const [showQRModal, setShowQRModal] = useState(false);
  const [qrError, setQrError] = useState('');
  const [qrLoading, setQrLoading] = useState(false);

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
  const [originalText, setOriginalText] = useState('הצג טקסט מקורי (ללא תרגום)');

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
      setDataLanguage('he');
      setOriginalText('הצג טקסט מקורי (ללא תרגום)');
    } else if (checkedLanguage === 'English') {
      english();
      setDirection('ltr'); // Set direction to ltr
      sessionStorage.setItem('direction', 'ltr');
      setforgotPassmassage('To recover your password, please contact 054-464-3843');
      setErrormessage('Username or password are not valid');
      setDataLanguage('en');
      setOriginalText('Show Original Text (No Translation)');
    } else if (checkedLanguage === 'Arabic') {
      arabic();
      setDirection('rtl'); // Set direction to rtl
      sessionStorage.setItem('direction', 'rtl');
      setforgotPassmassage(' للحصول على كلمة مرورك، يرجى الاتصال ب 3843-464-054  ');
      setErrormessage('اسم المستخدم او كلمة المرور غير صالحة');
      setDataLanguage('ar');
      setOriginalText('عرض النص الأصلي (بدون ترجمة)');
    }
  };

  const { English, Arabic, Hebrew } = checked;

  if (Hebrew) {
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

  const processRouteData = async (routeData) => {
    // Normalize: support both Node format and WP format
    let taskIds = [];
    let site_id = null;
    let siteName = '';
    let routeName = '';

    if (routeData.tasks && Array.isArray(routeData.tasks) && routeData.tasks[0]?.taskId) {
      // Node format: { id, name, tasks: [{position, taskId}], sites: [{id, name}] }
      taskIds = routeData.tasks
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .map(t => t.taskId);
      site_id = routeData.sites?.[0]?.id;
      siteName = routeData.sites?.[0]?.name || '';
      routeName = routeData.name || '';
    } else if (routeData.acf?.tasks) {
      // WP format: { id, title.rendered, acf: { tasks: [{ID}] }, places: [siteIds] }
      taskIds = routeData.acf.tasks.map(t => t.ID || t.id).filter(Boolean);
      site_id = routeData.places?.[0]
        ? String(routeData.places[0])
        : null;
      siteName = '';
      routeName = routeData.title?.rendered || routeData.name || '';
    } else {
      return { error: language === 'english' ? 'QR code does not contain valid route data' : language === 'arabic' ? 'رمز QR لا يحتوي على بيانات مسار صالحة' : 'קוד QR לא מכיל נתוני מסלול תקינים' };
    }

    if (!site_id) {
      return { error: language === 'english' ? 'Route has no site information' : language === 'arabic' ? 'لا توجد معلومات موقع' : 'אין מידע על אתר במסלול' };
    }

    if (!taskIds.length) {
      return { error: language === 'english' ? 'Route has no tasks' : language === 'arabic' ? 'لا توجد مهام في المسار' : 'אין משימות במסלול' };
    }

    const fetchedTasks = await getingDataTasksByIdsFromNodejs(taskIds);
    if (!fetchedTasks || fetchedTasks.length === 0) {
      return { error: language === 'english' ? 'Could not load tasks for this route' : language === 'arabic' ? 'تعذر تحميل المهام' : 'לא ניתן לטעון משימות למסלול זה' };
    }

    // Add stationDetails BEFORE building taskMap so the spread copies in cleanList include it
    addStationDetailsToTask(fetchedTasks, {});

    const taskMap = {};
    fetchedTasks.forEach(t => { if (t) taskMap[t.id || t.ID] = t; });

    const routeTaskRefs = taskIds.map(id => ({ ID: id, id }));
    const expanded = expandRouteTasksWithLoops(taskMap, routeTaskRefs, routeData.acf?.loops || []);
    const [separateList, cleanList] = extractPathForSiteWithLoops(taskMap, expanded, site_id);

    if (!cleanList.length) {
      return { error: language === 'english' ? 'No tasks found for this route' : language === 'arabic' ? 'لم يتم العثور على مهام' : 'לא נמצאו משימות למסלול זה' };
    }

    return { separateList, cleanList, site_id, siteName, routeName, fetchedTasks };
  };

  const handleQRRouteScan = async (data) => {
    if (!data || data === 'error' || qrLoading) return;
    const qrText = (typeof data === 'object' && data !== null && data.text
      ? data.text
      : String(data)).trim();
    if (!qrText || qrText === 'error') return;

    setQrLoading(true);
    setQrError('');

    try {
      let routeData;

      // Try to parse as full JSON first
      try {
        routeData = JSON.parse(qrText);
      } catch (e) {
        // Treat as a plain route ID — fetch from API
        routeData = await getingDataRouteByIdFromNodejs(qrText);
        if (!routeData) {
          setQrError(language === 'english' ? `Route not found: ${qrText}` : language === 'arabic' ? 'المسار غير موجود' : `המסלול לא נמצא: ${qrText}`);
          setQrLoading(false);
          return;
        }
      }

      const result = await processRouteData(routeData);
      if (result.error) {
        setQrError(result.error);
        setQrLoading(false);
        return;
      }

      const { separateList, cleanList, site_id, siteName, routeName, fetchedTasks } = result;
      const anonName = language === 'english' ? 'guest' : language === 'arabic' ? 'ضيف' : 'אורח';
      localStorage.setItem('token', 'qr-anonymous-session');
      localStorage.setItem('userName', anonName);
      localStorage.setItem('userID', 'anonymous');
      localStorage.setItem('site_id', site_id);
      localStorage.setItem('site_title', siteName);
      localStorage.setItem('route_title', routeName);
      localStorage.setItem('guidphone', '');
      localStorage.setItem("route_id", routeData.id || routeData.ID || '');

      const currentDate = new Date().toISOString().split('T')[0];
      props.actions.changePlaces([{ id: site_id, title: siteName }], currentDate);
      props.actions.changeTasks(fetchedTasks, currentDate);
      props.actions.visitPlaces(site_id);
      props.actions.changeCurrentTasks(separateList);
      props.actions.changeCurrentTasksList(cleanList);
      props.actions.changeUser({
        username: anonName,
        isLoggedIn: true,
        id: 'anonymous',
        phone: '',
        arabicName: anonName,
        hebrewName: anonName,
        guideName: '',
        guidePhone: '0000000000',
        imgPath: null,
      });

      setShowQRModal(false);
      navigate(`/Tasks/${anonName}`);
    } catch (e) {
      console.error('QR scan error:', e);
      setQrError(language === 'english' ? `Error: ${e.message}` : language === 'arabic' ? 'حدث خطأ' : `שגיאה: ${e.message}`);
    } finally {
      setQrLoading(false);
    }
  };

  const handleManualRouteId = async (e) => {
    e.preventDefault();
    const id = e.target.elements.routeId.value.trim();
    if (!id) return;
    setQrLoading(true);
    setQrError('');
    try {
      const routeData = await getingDataRouteByIdFromNodejs(id);
      if (!routeData) {
        setQrError(language === 'english' ? 'Route not found' : language === 'arabic' ? 'المسار غير موجود' : 'המסלול לא נמצא');
        setQrLoading(false);
        return;
      }
      const result = await processRouteData(routeData);
      if (result.error) {
        setQrError(result.error);
        setQrLoading(false);
        return;
      }
      const { separateList, cleanList, site_id, siteName, routeName, fetchedTasks } = result;
      const anonName = language === 'english' ? 'guest' : language === 'arabic' ? 'ضيف' : 'אורח';
      localStorage.setItem('token', 'qr-anonymous-session');
      localStorage.setItem('userName', anonName);
      localStorage.setItem('userID', 'anonymous');
      localStorage.setItem('site_id', site_id);
      localStorage.setItem('site_title', siteName);
      localStorage.setItem('route_title', routeName);
      const currentDate = new Date().toISOString().split('T')[0];
      props.actions.changePlaces([{ id: site_id, title: siteName }], currentDate);
      props.actions.changeTasks(fetchedTasks, currentDate);
      props.actions.visitPlaces(site_id);
      props.actions.changeCurrentTasks(separateList);
      props.actions.changeCurrentTasksList(cleanList);
      localStorage.setItem('anonymoususer', routeName);
      localStorage.setItem('guidphone', '');
      localStorage.setItem("route_id", routeData.id || routeData.ID || '');
      props.actions.changeUser({ username: anonName, isLoggedIn: true, id: 'anonymous', phone: '', arabicName: anonName, hebrewName: anonName, guideName: '', guidePhone: '0000000000', imgPath: null });
      setShowQRModal(false);
      navigate(`/Tasks/${anonName}`);
    } catch (e) {
      console.error('Manual route error:', e);
      setQrError(language === 'english' ? `Error: ${e.message}` : language === 'arabic' ? 'حدث خطأ' : `שגיאה: ${e.message}`);
    } finally {
      setQrLoading(false);
    }
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
      guidePhone: loggedInUser.coach?.phone || "",
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
    if (localStorage.getItem("token") === 'qr-anonymous-session') {
      return <Redirect to={`/Tasks/` + convertedUsername} noThrow />;
    }
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
          <label className="form-group" style={{ direction: ` ${direction}` }}>
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
          <label className="form-group" style={{ direction: ` ${direction}` }}>
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
          {/* <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '15px' }}>
            <label style={{ 
              fontSize: '14px', 
              color: '#666', 
              marginBottom: '5px',
              textAlign: 'center'
            }}>
              🌐 שפת תרגום נתונים / Data Translation / ترجمة البيانات
            </label>
            <DataLanguageSwitcher />
          </div> */}
          <label style={{
            // display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            cursor: 'pointer',
            color: 'aliceblue'
          }}>
            <input
              type="checkbox"
              checked={showOriginal}
              onChange={(e) => setShowOriginal(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            {originalText}
          </label>
          <br />
          <button className="btn mb-3" type="submit">
            {loginLanguage}
          </button>

          {/*{ loading && <img className="loader" src={Loader} alt="Loader"/> }*/}
        </form>
        <button
          className="btn qrLoginBtn"
          type="button"
          onClick={() => { setQrError(''); setShowQRModal(true); }}
          style={{ marginTop: '10px', backgroundColor: '#e8b221', borderColor: '#e8b221', color: '#272727', width: '16rem' }}
        >
          {language === 'english' ? '📷 Scan Route QR' : language === 'arabic' ? '📷 مسح رمز QR للمسار' : '📷 סרוק מסלול QR'}
        </button>
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
        <Modal
          isOpen={showQRModal}
          onRequestClose={() => setShowQRModal(false)}
          style={{
            overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999 },
            content: {
              // width: '90%',
              // maxWidth: '420px',
              height: 'auto',
              background: '#1e1e1e',
              border: 'none',
              borderRadius: '12px',
              padding: '20px',
              top: '50%',
              left: '50%',
              // transform: 'translate(-50%, -50%)',
              position: 'absolute',
              right: 'auto',
              bottom: 'auto',
            }
          }}
          contentLabel="QR Route Scanner"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ color: '#e8b221', margin: 0, fontSize: '18px' }}>
                {language === 'english' ? 'Scan Route QR Code' : language === 'arabic' ? 'امسح رمز QR للمسار' : 'סרוק קוד QR של מסלול'}
              </h3>
              <button onClick={() => setShowQRModal(false)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '22px', cursor: 'pointer' }}>✕</button>
            </div>
            {qrError && <p style={{ color: '#ff6b6b', margin: 0, textAlign: 'center', fontSize: '13px', wordBreak: 'break-word' }}>{qrError}</p>}
            {qrLoading
              ? <p style={{ color: '#e8b221', margin: 0, textAlign: 'center', fontSize: '14px' }}>
                {language === 'english' ? 'Loading route...' : language === 'arabic' ? 'جارٍ تحميل المسار...' : 'טוען מסלול...'}
              </p>
              : <div style={{ borderRadius: '8px', overflow: 'hidden', background: '#000' }}>
                <BarcodeComp onchange={handleQRRouteScan} />
              </div>
            }
            <p style={{ color: '#888', margin: '4px 0 0', textAlign: 'center', fontSize: '12px' }}>
              {language === 'english' ? '— or enter route ID manually —' : language === 'arabic' ? '— أو أدخل معرف المسار يدويًا —' : '— או הכנס מזהה מסלול ידנית —'}
            </p>
            <form onSubmit={handleManualRouteId} style={{ display: 'flex', gap: '6px' }}>
              <input
                name="routeId"
                placeholder={language === 'english' ? 'Route ID...' : language === 'arabic' ? 'معرف المسار...' : 'מזהה מסלול...'}
                style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #555', background: '#2a2a2a', color: '#fff', fontSize: '13px' }}
              />
              <button type="submit" style={{ padding: '8px 12px', background: '#e8b221', border: 'none', borderRadius: '6px', color: '#272727', fontWeight: 'bold', cursor: 'pointer' }}>
                {language === 'english' ? 'Go' : language === 'arabic' ? 'انتقال' : 'עבור'}
              </button>
            </form>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Login;
