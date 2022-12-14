
//function to publish the data in the 'Data Time' table for each task the user has done
export const postDataTime = (objTime) => {


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


};
