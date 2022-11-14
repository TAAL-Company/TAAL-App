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
  console.log("arrayOfId: " + arrayOfId);
  console.log("partial" + partial);
  console.log("newArray:", newArray);
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

export const trasformObject = (old_obj) => {
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
