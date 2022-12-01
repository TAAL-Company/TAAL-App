
export const postDataTime = (objTime) => {

    // if (localStorage.getItem("taskIdForApi") === 0) {
    //     localStorage.setItem('taskIdForApi', objTime.idTask);
    //     console.log("objTime.idTask: ", objTime.idTask)
    // }
    // else {
    //     if (localStorage.getItem("taskIdForApi") !== objTime.idTask) {
    //         localStorage.setItem('taskIdForApi', objTime.idTask);
    //         console.log("objTime.idTask: ", objTime.idTask)

            fetch("https://s83.bfa.myftpupload.com/wp-json/wp/v2/time_data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Basic WWFyZGVuIFBhbmlyeTpBeHhOIGxSUUUgVFFvdiB0OWtCIDQzUknCoGN5cFI=",
                },
                body: JSON.stringify(
                    {
                        "title": objTime.userName,
                        "fields": {
                            "user_id": objTime.idUser,
                            "route_id": objTime.route_id,
                            "task_id": objTime.idTask.toString(),
                            "start_time": objTime.startTime,
                            "end_time": objTime.endTime,
                            "req_help_time": "1"
                        },

                        "status": "publish"
                    }
                )
            })

        // }
    // }

};
