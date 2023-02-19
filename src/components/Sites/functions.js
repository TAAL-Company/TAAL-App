import { all } from "core-js/fn/promise";
import { stringify } from "qs";

/*
    The function gets - full: all tasks data , partial: the user's tasks 
    and returns a new array of tasks
*/
export const getTasksList = (full, partial) => {
  let arrayOfId = [],
    newArray = [];
  console.log("getTasksList partial res:", partial);

  partial.forEach((route) => {
    // when the route list includes more than one route
    if (Array.isArray(route)) {
      route.forEach((task) => {
        arrayOfId.push(task.ID);
      });
    } else arrayOfId.push(route.ID);
  });
  arrayOfId.forEach((element) => {
    console.log("full[element]: " + full[element]);
    newArray.push(full[element]);
  });
  // console.log("arrayOfId: " + arrayOfId);
  // console.log("partial" + partial);
  console.log("getTasksList function res:", newArray);
  return newArray;
};

/*

*/
export const getPlacesList = (places, tasksList) => {
  let placesList = [];
  let placesArray,
    temp = [];

  tasksList.forEach((item) => {
    placesArray = item.places;

    if (placesArray.length > 0) {
      if (places[placesArray[0]].parent === 0) {
        if (!temp.includes(places[placesArray[0]].id)) {
          placesList.push(places[placesArray[0]]);
          temp.push(places[placesArray[0]].id);
        }
      } else {
        if (!temp.includes(places[places[placesArray[0]].parent].id)) {
          placesList.push(places[places[placesArray[0]].parent]);
          temp.push(places[places[placesArray[0]].parent].id);
        }
      }
    }
  });
  return placesList;
};

export const trasformObject = async (old_obj) => {
  let newObj = {};
  old_obj.forEach((element) => {
    newObj[element.id] = element;
  });
  console.log("after newObj", newObj);
  return newObj;
};

export const transformArrayOfObjects = (list) => {
  let newList = {};
  list.forEach((item) => {
    newList[item.id] = item;
  });
  return newList;
};

export const extractPathForSite = (
  userTasks,
  siteID,
  user_tasks_total = null
) => {
  let listForExec = [],
    cleanList = [];
  let index = 0;
  let temp = -1;
  userTasks.forEach((currentTask) => {
    if (currentTask.places.includes(parseInt(siteID))) {
      let endIndex = currentTask.places.length - 1;
      cleanList.push(currentTask);
      if (currentTask.places[endIndex] !== temp) {
        temp = currentTask.places[endIndex];
        index++;
      }
      user_tasks_total
        ? (currentTask["didFinish"] =
          user_tasks_total[currentTask.id].didFinish)
        : (currentTask["didFinish"] = null);
      listForExec[index]
        ? listForExec[index].push(currentTask)
        : (listForExec[index] = [currentTask]);
    }
  });
  if (!listForExec[0]) listForExec = listForExec.slice(1);

  return [listForExec, cleanList];
};
// export const extractPathForSite = (userTasks, siteID, user_tasks_total = null) => {
//   // Filter userTasks array to only include tasks that have the specified siteID in the places array
//   const cleanList = userTasks.filter(currentTask =>
//     currentTask.places.includes(parseInt(siteID))
//   );

//   // Set didFinish property of each task in cleanList to the corresponding value in user_tasks_total object
//   // If user_tasks_total is not provided, set didFinish to null
//   cleanList.forEach(task => {
//     if (user_tasks_total) {
//       task.didFinish = user_tasks_total[task.id].didFinish;
//     } else {
//       task.didFinish = null;
//     }
//   });

//   // Organize tasks in cleanList into sub-arrays based on their ending place
//   const listForExec = cleanList.reduce((result, task) => {
//     const endIndex = task.places.length - 1;
//     if (!result[endIndex]) {
//       // If a sub-array for the current ending place does not exist, create a new one
//       result[endIndex] = [task];
//     } else {
//       // If a sub-array for the current ending place already exists, push the current task into it
//       result[endIndex].push(task);
//     }
//     return result;
//   }, []);

//   // Return listForExec and cleanList arrays
//   return [listForExec, cleanList];
// };

export const getUserTasksFromRouteList = (routesInfo, userID) =>

  // console.log("userID: " + userID);
  // console.log("routesInfo: " + routesInfo);

new Promise((resolve, reject) => {
  const list = routesInfo.reduce((accu, curr) => {
    if (curr.acf.users) {
      curr.acf.users.forEach((element) => {
        //console.log('Success?', element.ID.toString() === userID.toString());

        if (element.ID.toString() === userID) {
          accu.push(curr.acf.tasks);
        }
      });
    }
    return accu;
  }, []);
  resolve(list);
  reject([]);
});

export const addStationDetailsToTask = (userTasks, place) => {
  console.log("xx userTasks: ", userTasks)
  console.log("xx place: ", place)

  let copyUserTasks = [...userTasks];
  copyUserTasks.forEach((task) => {
    task["stationDetails"] = place[task.places[task.places.length - 1]];
  });
  return copyUserTasks;
};
// export const getRoutesOfUser = (allRoutes, userId) => {

//   console.log("getRoutesOfUser allRoutes"+ stringify( allRoutes))
//   let allRoutesOfUser = [];
//   allRoutes.map(async (route) => {
//     console.log("getRoutesOfUser route"+ route.acf.users)
//     allRoutesOfUser.push(await route.acf.users.find((user) => user.ID === userId))
//     // allRoutesOfUser = allRoutesOfUser + route.acf.users.filter((user) => user.ID === userId)
//   })

//   return allRoutesOfUser;
// }

export const getRoutesOfUser = (allRoutes, userID) => {
  console.log("getRoutesOfUser allRoutes" + allRoutes)

  const routes = allRoutes.filter((route) => {
    if (Array.isArray(route.acf.users) && route.acf.users.find((user) => user.ID === userID)) {
      return true;
    }
    return false;
  });
  return routes;
};