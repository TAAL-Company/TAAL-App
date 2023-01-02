/*
    The function gets - full: all tasks data , partial: the user's tasks 
    and returns a new array of tasks
*/
export const getTasksList = (full, partial) => {
  let arrayOfId = [],
    newArray = [];
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

export const getUserTasksFromRouteList = (data, userID) =>
  new Promise((resolve, reject) => {
    const list = data.reduce((accu, curr) => {
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
  let copyUserTasks = [...userTasks];
  copyUserTasks.forEach((task) => {
    task["stationDetails"] = place[task.places[task.places.length - 1]];
  });
  return copyUserTasks;
};
