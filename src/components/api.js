import wpConfig from "../wp-config";
import azureConfig from "../azure-config";
import axios from "axios";
import { IS_NODE } from "../components/Sites/Sites";

//function to publish the data in the 'Data Time' table for each task the user has done
export const postDataTime = (objTime) => {

    if (IS_NODE) {
        fetch(azureConfig.getTaskPerformance, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "taskId": objTime.idTask.toString(),
                "studentId": objTime.idUser,
                "routeId": objTime.route_id,
                "siteId": objTime.site_id,
                "startTime": objTime.startTime,
                "endTime": objTime.endTime,
                "whenAssisted": objTime.currdateAndTime,
            })
        })
    } else {
        const userNameApi = process.env.REACT_APP_USERNAME_ACCESSKEY;
        const passwordApi = process.env.REACT_APP_PASSWORD_ACCESSKEY;
        const base64encodedData = Buffer.from(`${userNameApi}:${passwordApi}`).toString('base64');

        fetch("https://s83.bfa.myftpupload.com/wp-json/wp/v2/time_data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `basic ${base64encodedData}`,
            },
            body: JSON.stringify(
                {
                    "title": objTime.userName,
                    "fields": {
                        "user_id": objTime.idUser,
                        "route_id": objTime.route_id,
                        "site_id": objTime.site_id,
                        "route_title": objTime.route_title,
                        "task_id": objTime.idTask.toString(),
                        "task_title": objTime.task_location,
                        "start_time": objTime.startTime,
                        "end_time": objTime.endTime,
                        "req_help_time": "1"
                    },

                    "status": "publish"
                }
            )
        })
    }



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

export const getingDataTasks = async (setCompleted, setnumOfTasks) => {

    let allTasks;


    await get(wpConfig.getTasks, {
        params: {
            per_page: 100,
            "Cache-Control": "no-cache",
        },
    }).then((res) => {
        let max_pages = res.headers["x-wp-totalpages"];
        setnumOfTasks(res.headers["x-wp-total"])

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
                    setCompleted((prevCompleted) => parseInt(prevCompleted + plusToCompleted));

                    Array.prototype.push.apply(allTasks, res.data);
                });
            }
        }
    });

    return allTasks;
};

export const getingDataRoutes = async () => {

    let allRoutes;
    console.log('geting data routes', `${wpConfig}/wp-json/wp/v2/routes/`)

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

export const getingDataUsersFromNodejs = async () => {
    let allUsers;
    // console.log('geting data routes', `${wpConfig}/wp-json/wp/v2/routes/`)
    console.log("geting data users");
    try {
        await get(azureConfig.getUsers).then((res) => {
            console.log("getUsers", res.data);
            allUsers = res.data
        });
        return allUsers
    } catch (error) {
        console.error(error)
        return null;
    }

};

export const getingDataRoutesFromNodejs = async () => {
    let allRoutes;
    console.log("geting data Routes");
    try {
        await get(azureConfig.getRoutes).then((res) => {
            console.log("getRoutes", res.data);
            allRoutes = res.data
        });
        return allRoutes
    } catch (error) {
        console.error(error)
        return null;
    }
};

export const getingDataPlacesFromNodejs = async () => {
    let allPlaces;
    console.log("geting data Places");
    try {
        await get(azureConfig.getPlaces).then((res) => {
            console.log("getPlaces", res.data);
            allPlaces = res.data
        });
        return allPlaces
    } catch (error) {
        console.error(error)
        return null;
    }
};

export const getingTasksById = async (taskid) => {
    let taskinfo;
    // console.log(taskid);
    try {
        await get(azureConfig.getTasks + "/" + taskid).then((res) => {
            // console.log("task info", res.data);
            taskinfo = res.data
        });
        return taskinfo
    } catch (error) {
        console.error(error)
        return null;
    }
}

export const getingDataTasksFromNodejs = async (setCompleted, setnumOfTasks) => {
    let allTasks;
    console.log("geting data Tasks");
    try {
        await get(azureConfig.getTasks).then((res) => {
            console.log("getTasks", res.data);

            let max_pages = res.data.length;
            setnumOfTasks(res.data.length)

            let plusToCompleted = 100 / max_pages;
            setCompleted((prevCompleted) => parseInt(prevCompleted + plusToCompleted));

            allTasks = res.data;
        });
        return allTasks
    } catch (error) {
        console.error(error)
        return null;
    }
};