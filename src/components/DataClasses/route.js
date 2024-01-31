
const wpRouteFromNoRoute = (noRoute) => {

    // ----places/sites---
    let PlaceSiteInWP=[]
    noRoute.sites.map((PlaceSiteId) => {
        PlaceSiteInWP.push(PlaceSiteId.id)
    })

    // ----users---
    let usersInWP=[]
    noRoute.students.map((student) => {
        user.ID = student.id
        user.user_email = student.email
        user.display_name = student.name
        user.user_avatar = student.picture_url
        user.user_nicename = student.user_name
        usersInWP.push(user)
    })

    // ----tasks----
    let tasksInWP=[]
    noRoute.tasks.map(async (taskId) => {
        let tasksbyid = await getingTasksById(taskId.taskId)
        tasks.ID = tasksbyid.id
        tasks.post_name = tasksbyid.subtitle
        tasks.post_title = tasksbyid.title
        tasksInWP.push(tasks)
    })

    return ({
        id: noRoute.id,
        title: noRoute.name,

        places: PlaceSiteInWP,

        acf: {
            users: usersInWP,
            tasks: tasksInWP
        }
    });
}      

let wpRoute = {
    "id": 0,
    "date": "",
    "date_gmt": "",
    "guid": {
        "rendered": "https:\/\/taal.tech\/?post_type=routes&#038;p=2936"
    },
    "modified": "",
    "modified_gmt": "",
    "slug": "",
    "status": "publish",
    "type": "routes",
    "link": "https:\/\/taal.tech\/routes",
    "title": {
        "rendered": ""
    },
    "content": {
        "rendered": "",
        "protected": false
    },
    "featured_media": 0,
    "parent": 0,
    "template": "",
    "meta": [

    ],
    "places": [],
    "acf": {
        "tasks": [],
        "users": [],
        "my_site": ""
    },
    "_links": {
        "self": [
            {
                "href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/routes\/2936"
            }
        ],
        "collection": [
            {
                "href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/routes"
            }
        ],
        "about": [
            {
                "href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/types\/routes"
            }
        ],
        "wp:attachment": [
            {
                "href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/media?parent=2936"
            }
        ],
        "wp:term": [
            {
                "taxonomy": "places",
                "embeddable": true,
                "href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/places?post=2936"
            }
        ],
        "curies": [
            {
                "name": "wp",
                "href": "https:\/\/api.w.org\/{rel}",
                "templated": true
            }
        ]
    }
}
let user = {
    "ID": 0,
    "user_firstname": "",
    "user_lastname": "",
    "nickname": "",
    "user_nicename": "",
    "display_name": "",
    "user_email": "",
    "user_url": "",
    "user_registered": "",
    "user_description": "",
    "user_avatar": "<img alt='' src='https:\/\/secure.gravatar.com\/avatar\/a7543504a4b2e386f27fc80ff2abd03d?s=96&#038;d=mm&#038;r=g' srcset='https:\/\/secure.gravatar.com\/avatar\/a7543504a4b2e386f27fc80ff2abd03d?s=192&#038;d=mm&#038;r=g 2x' class='avatar avatar-96 photo' height='96' width='96' loading='lazy' decoding='async'\/>"
}
let tasks = {
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