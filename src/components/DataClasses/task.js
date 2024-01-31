import { getingTasksById } from "./api";

const wpTasksFromNoTasks = async (noTask) => {
    let tasksbyid = await getingTasksById(noTask.taskId)

    return ({
        ID: tasksbyid.id,
        post_name: tasksbyid.subtitle || "",
        post_title: tasksbyid.title || ""
    });
}

const wpTasksSamplelet = {
    "ID": 0,
    "post_author": "0",
    "post_date": "",
    "post_date_gmt": "",
    "post_content": "",
    "post_title": "",
    "post_excerpt": "",
    "post_status": "publish",
    "comment_status": "closed",
    "ping_status": "closed",
    "post_password": "",
    "post_name": "",
    "to_ping": "",
    "pinged": "",
    "post_modified": "",
    "post_modified_gmt": "",
    "post_content_filtered": "",
    "post_parent": 0,
    "guid": "https:\/\/taal.tech\/",
    "menu_order": 0,
    "post_type": "tasks",
    "post_mime_type": "",
    "comment_count": "0",
    "filter": "raw"
}