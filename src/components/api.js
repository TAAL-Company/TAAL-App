import wpConfig from "../wp-config";
import axios from "axios";

//function to publish the data in the 'Data Time' table for each task the user has done
export const postDataTime = (objTime) => {
  const userNameApi = process.env.REACT_APP_USERNAME_ACCESSKEY;
  const passwordApi = process.env.REACT_APP_PASSWORD_ACCESSKEY;
  const base64encodedData = Buffer.from(
    `${userNameApi}:${passwordApi}`
  ).toString("base64");

  console.log(objTime);

  fetch("https://prod-web-app0da5905.azurewebsites.net/task-performance", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify({
      // title: objTime.userName,
      // fields: {
      studentId: "a71f5b1f-f12c-49c3-9c85-05999062329c", //objTime.idUser,
      routeId: objTime.route_id,
      siteId: objTime.site_id,
      // route_title: objTime.route_title,
      taskId: objTime.idTask,
      // task_title: objTime.task_location,
      startTime: objTime.startTime,
      endTime: objTime.endTime,
      whenAssisted: "2023-03-09T11:01:56.993Z",
      // },
    }),
  });
};

export const get = async (url, header) => {
  try {
    const res = await axios.get(url, header);
    if (res) {
      return res;
    }
  } catch (e) {
    console.log(e);
  }
};

export const getingData_Tasks = async (setCompleted, setnumOfTasks) => {
  let allTasks;

  await get("https://prod-web-app0da5905.azurewebsites.net/tasks").then(
    (res) => {
      setCompleted(100);
      allTasks = res.data;
    }
  );

  return allTasks;
};

export const getingDataTasks = async (setCompleted, setnumOfTasks) => {
  let allTasks;

  await get(wpConfig.getTasks, {
    params: {
      per_page: 100,
      "Cache-Control": "no-cache",
    },
  }).then((res) => {
    let max_pages = res.headers["x-wp-totalpages"];
    setnumOfTasks(res.headers["x-wp-total"]);

    let plusToCompleted = 100 / max_pages;

    setCompleted((prevCompleted) => parseInt(prevCompleted + plusToCompleted));

    allTasks = res.data;
    if (max_pages > 1) {
      for (let i = 2; i <= max_pages; i++) {
        get(wpConfig.getTasks, {
          params: {
            per_page: 100,
            page: i,
            "Cache-Control": "no-cache",
          },
        }).then((res) => {
          setCompleted((prevCompleted) =>
            parseInt(prevCompleted + plusToCompleted)
          );

          Array.prototype.push.apply(allTasks, res.data);
        });
      }
    }
  });

  return allTasks;
};
export const getingData_Routes = async () => {
  let allRoutes;

  await get("https://prod-web-app0da5905.azurewebsites.net/routes").then(
    (res) => {
      allRoutes = res.data;
    }
  );
  console.log("res allRoutes: ", allRoutes);

  return allRoutes;
};
export const getingDataRoutes = async () => {
  let allRoutes;
  console.log("geting data routes", `${wpConfig}/wp-json/wp/v2/routes/`);

  await get(wpConfig.getRoutes, {
    params: {
      per_page: 100,
      "Cache-Control": "no-cache",
    },
  }).then((res) => {
    let max_pages = res.headers["x-wp-totalpages"];

    allRoutes = res.data;
    if (max_pages > 1) {
      for (let i = 2; i <= max_pages; i++) {
        get(wpConfig.getRoutes, {
          params: {
            per_page: 100,
            page: i,
            "Cache-Control": "no-cache",
          },
        }).then((res) => {
          Array.prototype.push.apply(allRoutes, res.data);
        });
      }
    }
  });

  return allRoutes;
};
export const getingData_Places = async () => {
  let allPlaces;

  await get("https://prod-web-app0da5905.azurewebsites.net/sites", {
    params: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
    },
  }).then((res) => {
    allPlaces = res.data;
  });

  console.log("res places: ", allPlaces);

  return allPlaces;
};
export const getingDataPlaces = async () => {
  let allPlaces;

  await get(wpConfig.getPlaces, {
    params: {
      per_page: 100,
      "Cache-Control": "no-cache",
    },
  }).then((res) => {
    let max_pages = res.headers["x-wp-totalpages"];

    allPlaces = res.data;
    if (max_pages > 1) {
      for (let i = 2; i <= max_pages; i++) {
        get(wpConfig.getPlaces, {
          params: {
            per_page: 100,
            page: i,
            "Cache-Control": "no-cache",
          },
        }).then((res) => {
          Array.prototype.push.apply(allPlaces, res.data);
        });
      }
    }
  });

  return allPlaces;
};
export const getingData_Users = async () => {
  let all_Users;

  await get("https://prod-web-app0da5905.azurewebsites.net/students").then(
    (res) => {
      all_Users = res.data;
    }
  );
  console.log("res all_Users: ", all_Users);

  return all_Users;
};
