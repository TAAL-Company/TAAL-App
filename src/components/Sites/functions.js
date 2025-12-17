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
    if (element.id !== undefined)
      newObj[element.id] = element;
    else
      newObj[element.ID] = element;

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

export const getRoutesOfUserInTheSite = (routesList, siteId) => {

  let routeListInSite = routesList.filter(route => route.places.find(place => place == siteId))

  return routeListInSite
}

export const extractPathForSite = (
  alltasks,
  userTasks,
  siteID,
  user_tasks_total = null
) => {
  let listForExec = [],
    cleanList = [];
  let index = 0;
  let temp = -1;

  console.log("userTasks", userTasks)

  userTasks.forEach((task) => {

    let currentTask = alltasks.find(taskTemp => taskTemp.id === task.ID)

    // if (currentTask.places.includes(parseInt(siteID))) {
      console.log("currentTask.places.length",currentTask);
      let endIndex = currentTask.places.length - 1;
      cleanList.push(currentTask);

      console.log("endIndex", endIndex)

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
    // }
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

export const getUserTasksFromRouteList = (routesInfo, userID, userEmail) => {

  console.log('getUserTasksFromRouteList')
  // console.log("getUserTasksFromRouteList" + userID);
  // console.log("routesInfo: " + routesInfo);

  return new Promise((resolve, reject) => {
    const list = routesInfo.reduce((accu, curr) => {
      if (curr.acf.users) {
        curr.acf.users.forEach((element) => {
          //console.log('Success?', element.ID.toString() === userID.toString());

          if (element.ID.toString() === userID || element.user_email === userEmail) {
            accu.push(curr.acf.tasks);
          }
        });
      }
      return accu;
    }, []);
    resolve(list || []);
    reject([]);
  });
}

export const addStationDetailsToTask = (userTasks, place) => {

  let copyUserTasks = [...userTasks];
  copyUserTasks.forEach((task) => {
    task["stationDetails"] =  task.stations[0]// place[task.places[task.places.length - 1]];
  });
  return copyUserTasks;
};

// ---- Loops helpers ----
const parseTimeToSeconds = (mmss) => {
  if (!mmss || typeof mmss !== "string" || !mmss.includes(":")) return null;
  const [mm, ss] = mmss.split(":").map((v) => parseInt(v, 10));
  if (isNaN(mm) || isNaN(ss)) return null;
  return mm * 60 + ss;
};

const buildTaskMap = (tasksLike) => {
  if (!tasksLike) return {};
  if (Array.isArray(tasksLike)) {
    const m = {};
    for (const t of tasksLike) {
      if (!t) continue;
      const id = t.id || t.ID;
      if (id != null) m[id] = t;
    }
    return m;
  }
  // assume it's already a map
  return tasksLike;
};

// Decide repeat count by precedence: loopDuration (minutes) -> loopIteration -> loopUntil (mm:ss)
const getRepeatCount = (loop, segmentTaskIds, tasksMap) => {
  // compute one-iteration duration in seconds based on task Estimated_time (seconds)
  const perIterationSeconds = segmentTaskIds.reduce((sum, taskId) => {
    const t = tasksMap[taskId];
    const secs = Number(t?.acf?.Estimated_time) || 0;
    return sum + secs;
  }, 0);

  // safety net
  const safe = (n) => Math.max(1, Math.min(100, Math.floor(n)));

  if (loop.loopDuration != null && !isNaN(loop.loopDuration)) {
    const targetSec = Number(loop.loopDuration) * 60; // minutes -> seconds
    if (perIterationSeconds > 0) return safe(Math.ceil(targetSec / perIterationSeconds));
    return 1;
  }
  if (loop.loopIteration != null && !isNaN(loop.loopIteration)) {
    return safe(Number(loop.loopIteration));
  }
  if (loop.loopUntil) {
    const targetSec = parseTimeToSeconds(loop.loopUntil);
    if (targetSec && perIterationSeconds > 0) return safe(Math.ceil(targetSec / perIterationSeconds));
  }
  return 1;
};

// Expand a route's task references with loop repetitions and annotate with loopMeta
// routeTasks: array of refs with .ID (original order); loops: array with startingTaskIndex, endingTaskIndex, etc.
export const expandRouteTasksWithLoops = (allTasksOrMap, routeTasks, loops = []) => {
  if (!Array.isArray(routeTasks) || routeTasks.length === 0) return [];
  if (!Array.isArray(loops) || loops.length === 0) return routeTasks.slice();
  const tasksMap = buildTaskMap(allTasksOrMap);

  // Sort loops by starting index to expand in route order
  const sortedLoops = [...loops].sort((a, b) => (a.startingTaskIndex ?? 0) - (b.startingTaskIndex ?? 0));
  let i = 0;
  const out = [];

  for (const loop of sortedLoops) {
    const start = Math.max(0, Math.min(routeTasks.length - 1, Number(loop.startingTaskIndex)));
    const end = Math.max(start, Math.min(routeTasks.length - 1, Number(loop.endingTaskIndex)));
    // push tasks before loop
    while (i < start) {
      out.push(routeTasks[i]);
      i++;
    }

    const segment = routeTasks.slice(start, end + 1);
  const segmentIds = segment.map((t) => t.ID ?? t.id);
  const repeat = getRepeatCount(loop, segmentIds, tasksMap);

    for (let rep = 1; rep <= repeat; rep++) {
      for (const ref of segment) {
        const meta = {
          loopId: loop.ID || loop.id || `${start}-${end}`,
          loopDuration: loop.loopDuration ?? null,
          loopIteration: loop.loopIteration ?? null,
          loopUntil: loop.loopUntil ?? null,
          iterationIndex: rep,
          iterationCount: repeat,
          startingTaskIndex: start,
          endingTaskIndex: end,
          stationId: loop.stationId ?? null,
        };
        out.push({ ...ref, __loopMeta: meta });
      }
    }
    i = end + 1; // skip original segment (replaced by expanded)
  }

  // push any remaining tasks after last loop
  while (i < routeTasks.length) {
    out.push(routeTasks[i]);
    i++;
  }

  return out;
};

// Same as extractPathForSite but preserves loop meta from expanded route refs
export const extractPathForSiteWithLoops = (
  allTasksOrMap,
  userTasksExpanded,
  siteID,
  user_tasks_total = null
) => {
  const tasksMap = buildTaskMap(allTasksOrMap);
  let listForExec = [],
    cleanList = [];
  let index = 0;
  let temp = -1;

  userTasksExpanded.forEach((taskRef) => {
    const id = taskRef.id || taskRef.ID;
    let baseTask = tasksMap[id];
    if (!baseTask) return; // skip if missing

    // Create a shallow copy so per-occurrence loop meta won't collide
    const currentTask = { ...baseTask };

    // Attach loop meta if present on the ref
    if (taskRef.__loopMeta) {
      currentTask.loopMeta = taskRef.__loopMeta;
    }

    cleanList.push(currentTask);

    const endIndex = (currentTask.places?.length || 1) - 1;
    if (currentTask.places && currentTask.places[endIndex] !== temp) {
      temp = currentTask.places[endIndex];
      index++;
    }
    currentTask["didFinish"] = user_tasks_total
      ? user_tasks_total[currentTask.id]?.didFinish ?? null
      : null;

    if (listForExec[index]) listForExec[index].push(currentTask);
    else listForExec[index] = [currentTask];
  });

  if (!listForExec[0]) listForExec = listForExec.slice(1);

  return [listForExec, cleanList];
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