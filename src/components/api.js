import axios from "axios";
import azureConfig from "../azure-config";
import wpConfig from "../wp-config";

//function to publish the data in the 'Data Time' table for each task the user has done
export const postDataTime = (objTime) => {
  const userNameApi = process.env.REACT_APP_USERNAME_ACCESSKEY;
  const passwordApi = process.env.REACT_APP_PASSWORD_ACCESSKEY;
  const base64encodedData = Buffer.from(
    `${userNameApi}:${passwordApi}`
  ).toString("base64");

  fetch("https://s83.bfa.myftpupload.com/wp-json/wp/v2/time_data", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `basic ${base64encodedData}`,
    },
    body: JSON.stringify({
      title: objTime.userName,
      fields: {
        user_id: objTime.idUser,
        route_id: objTime.route_id,
        site_id: objTime.site_id,
        route_title: objTime.route_title,
        task_id: objTime.idTask.toString(),
        task_title: objTime.task_location,
        start_time: objTime.startTime,
        end_time: objTime.endTime,
        req_help_time: "1",
      },

      status: "publish",
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
    console.log("get", e);
  }
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

export const getingDataUsers = async () => {
  let allUsers;
  // console.log('geting data routes', `${wpConfig}/wp-json/wp/v2/routes/`)
  console.log("geting data users");

  await get(azureConfig.getUsers).then((res) => {
    console.log("getUsers", res);
  });

  return allUsers;
};

export const getingDataRoutes = async () => {
  let allRoutes;
  console.log("geting data Routes");

  await get(azureConfig.getRoutes).then((res) => {
    console.log("getRoutes", res);
  });

  return allRoutes;
};

export const getingDataPlaces = async () => {
  let allPlaces;
  console.log("geting data Places");

  await get(azureConfig.getPlaces).then((res) => {
    console.log("getPlaces", res);
  });

  return allPlaces;
};

// export const getingDataRoutes = async () => {
//   let allRoutes;
//   // console.log('geting data routes', `${wpConfig}/wp-json/wp/v2/routes/`)
//   console.log("geting data routes", `${wpConfig}/routes/`);

//   await get(wpConfig.getRoutes, {
//     params: {
//       per_page: 100,
//       "Cache-Control": "no-cache",
//     },
//   }).then((res) => {
//     let max_pages = res.headers["x-wp-totalpages"];

//     allRoutes = res.data;
//     if (max_pages > 1) {
//       for (let i = 2; i <= max_pages; i++) {
//         get(wpConfig.getRoutes, {
//           params: {
//             per_page: 100,
//             page: i,
//             "Cache-Control": "no-cache",
//           },
//         }).then((res) => {
//           Array.prototype.push.apply(allRoutes, res.data);
//         });
//       }
//     }
//   });

//   return allRoutes;
// };

// export const getingDataPlaces = async () => {
//   let allPlaces;

//   await get(wpConfig.getPlaces, {
//     params: {
//       per_page: 100,
//       "Cache-Control": "no-cache",
//     },
//   }).then((res) => {
//     let max_pages = res.headers["x-wp-totalpages"];

//     allPlaces = res.data;
//     if (max_pages > 1) {
//       for (let i = 2; i <= max_pages; i++) {
//         get(wpConfig.getPlaces, {
//           params: {
//             per_page: 100,
//             page: i,
//             "Cache-Control": "no-cache",
//           },
//         }).then((res) => {
//           Array.prototype.push.apply(allPlaces, res.data);
//         });
//       }
//     }
//   });

//   return allPlaces;
// };
