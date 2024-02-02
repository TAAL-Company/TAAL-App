import { getingTasksById } from "./api";

export const isLoggedIn = () => {
	return localStorage.getItem('token');
};

export const handleLogout = () => {
	console.log('logout');
	localStorage.removeItem("token");
	window.location.href = "/";
};

export const getUserName = () => (
	localStorage.getItem('userName')
);

export const internetConnection = () => {
	const internetConditionFlag = navigator.onLine ? 'online' : 'offline';
	if (internetConditionFlag === 'online') {
		return new Promise((resolve) => {
			// Check for internet connectivity
			fetch('https://www.google.com/', {
				mode: 'no-cors',
			})
				.then(() => {
					resolve(true)
				}).catch(() => {
					resolve(false)
				})
		})

	} else
		return false
}

export const nodeRouteAdapter = (routedata) => {
	let noderoutedata = [];
	routedata.forEach((route) => {

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

		wpRoute.id = route.id
		wpRoute.title.rendered = route.name || '';

		// ----places/sites---
		route.sites.map(async (PlaceSiteId) => {
			wpRoute.places.push(PlaceSiteId.id)
		})

		// ----users---
		route.students.map((student) => {
			user.ID = student.id
			user.user_email = student.email
			user.display_name = student.name
			user.user_avatar = student.picture_url
			user.user_nicename = student.user_name
			wpRoute.acf.users.push({ ...user })
		})

		// ----tasks----
		route.tasks.map(async (taskId) => {
			let tasksbyid = await getingTasksById(taskId.taskId)
			tasks.ID = tasksbyid.id
			tasks.post_name = tasksbyid.subtitle
			tasks.post_title = tasksbyid.title
			wpRoute.acf.tasks.push({ ...tasks })
		})

		noderoutedata.push(wpRoute)
	})
	console.log("noderoutedata", noderoutedata);
	return noderoutedata
}

export const nodePlacesAdapter = (Placesdata) => {

	let nodePlacesdata = [];
	Placesdata.forEach((Places) => {

		let wpPlaces = {
			"id": 6,
			"count": 6,
			"description": "\u05d7\u05e0\u05d5\u05ea \u05de\u05d6\u05d5\u05df \u05d1\u05e8\u05d7\u05d5\u05d1 \u05e1\u05d5\u05e7\u05d5\u05dc\u05d5\u05d1 \u05d4\u05d5\u05d3 \u05d4\u05e9\u05e8\u05d5\u05df",
			"link": "https:\/\/taal.tech\/places\/ampm-%d7%9e%d7%92%d7%93%d7%99%d7%90%d7%9c\/",
			"name": "AmPm \u05de\u05d2\u05d3\u05d9\u05d0\u05dc",
			"slug": "ampm-%d7%9e%d7%92%d7%93%d7%99%d7%90%d7%9c",
			"taxonomy": "places",
			"parent": 0,
			"meta": [

			],
			"acf": {
				"image": {
					"ID": 482,
					"id": 482,
					"title": "IMG_20201218_123553",
					"filename": "IMG_20201218_123553.jpg",
					"filesize": 123053,
					"url": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/IMG_20201218_123553.jpg",
					"link": "https:\/\/taal.tech\/img_20201218_123553\/",
					"alt": "",
					"author": "13",
					"description": "",
					"caption": "",
					"name": "img_20201218_123553",
					"status": "inherit",
					"uploaded_to": 0,
					"date": "2021-07-18 12:01:25",
					"modified": "2021-07-18 12:02:36",
					"menu_order": 0,
					"mime_type": "image\/jpeg",
					"type": "image",
					"subtype": "jpeg",
					"icon": "https:\/\/taal.tech\/wp-includes\/images\/media\/default.png",
					"width": 800,
					"height": 600,
					"sizes": {
						"thumbnail": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/IMG_20201218_123553-150x150.jpg",
						"thumbnail-width": 150,
						"thumbnail-height": 150,
						"medium": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/IMG_20201218_123553-300x225.jpg",
						"medium-width": 300,
						"medium-height": 225,
						"medium_large": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/IMG_20201218_123553-768x576.jpg",
						"medium_large-width": 750,
						"medium_large-height": 563,
						"large": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/IMG_20201218_123553.jpg",
						"large-width": 750,
						"large-height": 563,
						"1536x1536": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/IMG_20201218_123553.jpg",
						"1536x1536-width": 800,
						"1536x1536-height": 600,
						"2048x2048": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/IMG_20201218_123553.jpg",
						"2048x2048-width": 800,
						"2048x2048-height": 600,
						"post-thumbnail": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/IMG_20201218_123553.jpg",
						"post-thumbnail-width": 800,
						"post-thumbnail-height": 600
					}
				},
				"audio": {
					"ID": 493,
					"id": 493,
					"title": "ampm magdiel",
					"filename": "ampm-magdiel.mp3",
					"filesize": 63405,
					"url": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/ampm-magdiel.mp3",
					"link": "https:\/\/taal.tech\/ampm-magdiel\/",
					"alt": "",
					"author": "13",
					"description": "\"ampm magdiel\".",
					"caption": "",
					"name": "ampm-magdiel",
					"status": "inherit",
					"uploaded_to": 0,
					"date": "2021-07-18 12:06:17",
					"modified": "2021-07-18 12:09:33",
					"menu_order": 0,
					"mime_type": "audio\/mpeg",
					"type": "audio",
					"subtype": "mpeg",
					"icon": "https:\/\/taal.tech\/wp-includes\/images\/media\/audio.png"
				},
				"defaultPath": "",
				"qr": {
					"ID": 500,
					"id": 500,
					"title": "am_PM_magdiel_6 QR",
					"filename": "am_PM_magdiel_6.png",
					"filesize": 2972,
					"url": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/am_PM_magdiel_6.png",
					"link": "https:\/\/taal.tech\/am_pm_magdiel_6\/",
					"alt": "",
					"author": "13",
					"description": "",
					"caption": "",
					"name": "am_pm_magdiel_6",
					"status": "inherit",
					"uploaded_to": 0,
					"date": "2021-07-18 12:10:29",
					"modified": "2021-08-23 09:25:53",
					"menu_order": 0,
					"mime_type": "image\/png",
					"type": "image",
					"subtype": "png",
					"icon": "https:\/\/taal.tech\/wp-includes\/images\/media\/default.png",
					"width": 200,
					"height": 200,
					"sizes": {
						"thumbnail": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/am_PM_magdiel_6-150x150.png",
						"thumbnail-width": 150,
						"thumbnail-height": 150,
						"medium": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/am_PM_magdiel_6.png",
						"medium-width": 200,
						"medium-height": 200,
						"medium_large": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/am_PM_magdiel_6.png",
						"medium_large-width": 200,
						"medium_large-height": 200,
						"large": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/am_PM_magdiel_6.png",
						"large-width": 200,
						"large-height": 200,
						"1536x1536": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/am_PM_magdiel_6.png",
						"1536x1536-width": 200,
						"1536x1536-height": 200,
						"2048x2048": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/am_PM_magdiel_6.png",
						"2048x2048-width": 200,
						"2048x2048-height": 200,
						"post-thumbnail": "https:\/\/taal.tech\/wp-content\/uploads\/2021\/07\/am_PM_magdiel_6.png",
						"post-thumbnail-width": 200,
						"post-thumbnail-height": 200
					}
				}
			},
			"_links": {
				"self": [
					{
						"href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/places\/6"
					}
				],
				"collection": [
					{
						"href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/places"
					}
				],
				"about": [
					{
						"href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/taxonomies\/places"
					}
				],
				"wp:post_type": [
					{
						"href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/tasks?places=6"
					},
					{
						"href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/routes?places=6"
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

		wpPlaces.id = Places.id
		wpPlaces.name = Places.name
		wpPlaces.description = Places.description
		// wpPlaces.slug = NOsites.description

		wpPlaces.acf.image.link = Places.picture_url || ""
		wpPlaces.acf.image.url = Places.picture_url || ""

		wpPlaces.acf.audio.link = Places.audio_url || ""
		wpPlaces.acf.audio.url = Places.audio_url || ""

		wpPlaces.acf.qr.url = Places.qr_code_url || ""
		wpPlaces.acf.qr.link = Places.qr_code_url || ""


		nodePlacesdata.push({ ...wpPlaces })
	})
	console.log("nodePlacesdata", nodePlacesdata);
	return nodePlacesdata
}

export const nodeTasksAdapter = (Tasksdata) => {
	let nodeTasksdata = [];
	Tasksdata.forEach((Taskdata) => {
		let wpTasks = {
			"id": 3445,
			"date": "2023-06-11T14:20:23",
			"date_gmt": "2023-06-11T12:20:23",
			"guid": {
				"rendered": "https:\/\/taal.tech\/?post_type=tasks&#038;p=3445"
			},
			"modified": "2023-06-11T14:20:25",
			"modified_gmt": "2023-06-11T12:20:25",
			"slug": "down-to-the-lobby",
			"status": "publish",
			"type": "tasks",
			"link": "https:\/\/taal.tech\/tasks\/down-to-the-lobby\/",
			"title": {
				"rendered": "Down to the Lobby"
			},
			"content": {
				"rendered": "\n<p>We take the stairs to the lobby<\/p>\n",
				"protected": false
			},
			"featured_media": 0,
			"template": "",
			"meta": [],
			"places": [
			],
			"acf": {
				"image": {
					"ID": 3419,
					"id": 3419,
					"title": "hallway",
					"filename": "hallway.jpeg",
					"filesize": 50760,
					"url": "https:\/\/taal.tech\/wp-content\/uploads\/2023\/06\/hallway.jpeg",
					"link": "https:\/\/taal.tech\/tasks\/down-to-the-lobby\/hallway\/",
					"alt": "",
					"author": "27",
					"description": "",
					"caption": "",
					"name": "hallway",
					"status": "inherit",
					"uploaded_to": 3445,
					"date": "2023-06-11 11:05:14",
					"modified": "2023-06-11 12:20:25",
					"menu_order": 0,
					"mime_type": "image\/jpeg",
					"type": "image",
					"subtype": "jpeg",
					"icon": "https:\/\/taal.tech\/wp-includes\/images\/media\/default.png",
					"width": 952,
					"height": 648,
					"sizes": {
						"thumbnail": "https:\/\/taal.tech\/wp-content\/uploads\/2023\/06\/hallway-150x150.jpeg",
						"thumbnail-width": 150,
						"thumbnail-height": 150,
						"medium": "https:\/\/taal.tech\/wp-content\/uploads\/2023\/06\/hallway-300x204.jpeg",
						"medium-width": 300,
						"medium-height": 204,
						"medium_large": "https:\/\/taal.tech\/wp-content\/uploads\/2023\/06\/hallway-768x523.jpeg",
						"medium_large-width": 750,
						"medium_large-height": 511,
						"large": "https:\/\/taal.tech\/wp-content\/uploads\/2023\/06\/hallway.jpeg",
						"large-width": 750,
						"large-height": 511,
						"1536x1536": "https:\/\/taal.tech\/wp-content\/uploads\/2023\/06\/hallway.jpeg",
						"1536x1536-width": 952,
						"1536x1536-height": 648,
						"2048x2048": "https:\/\/taal.tech\/wp-content\/uploads\/2023\/06\/hallway.jpeg",
						"2048x2048-width": 952,
						"2048x2048-height": 648,
						"post-thumbnail": "https:\/\/taal.tech\/wp-content\/uploads\/2023\/06\/hallway.jpeg",
						"post-thumbnail-width": 952,
						"post-thumbnail-height": 648
					}
				},
				"audio": {
					"ID": 3446,
					"id": 3446,
					"title": "to the lobby",
					"filename": "to-the-lobby.mp3",
					"filesize": 51407,
					"url": "https:\/\/taal.tech\/wp-content\/uploads\/2023\/06\/to-the-lobby.mp3",
					"link": "https:\/\/taal.tech\/tasks\/down-to-the-lobby\/to-the-lobby\/",
					"alt": "",
					"author": "27",
					"description": "\"to the lobby\".",
					"caption": "",
					"name": "to-the-lobby",
					"status": "inherit",
					"uploaded_to": 3445,
					"date": "2023-06-11 12:20:11",
					"modified": "2023-06-11 12:20:14",
					"menu_order": 0,
					"mime_type": "audio\/mpeg",
					"type": "audio",
					"subtype": "mpeg",
					"icon": "https:\/\/taal.tech\/wp-includes\/images\/media\/audio.png"
				},
				"minimum_profile": "0",
				"max_time": "0",
				"sub_tasks": "",
				"sub_task": false,
				"Estimated_time": "1"
			},
			"_links": {
				"self": [
					{
						"href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/tasks\/3445"
					}
				],
				"collection": [
					{
						"href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/tasks"
					}
				],
				"about": [
					{
						"href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/types\/tasks"
					}
				],
				"wp:attachment": [
					{
						"href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/media?parent=3445"
					}
				],
				"wp:term": [
					{
						"taxonomy": "places",
						"embeddable": true,
						"href": "https:\/\/taal.tech\/wp-json\/wp\/v2\/places?post=3445"
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

		wpTasks.id=Taskdata.id
		wpTasks.title.rendered= Taskdata.title.rendered || '';
		wpTasks.content.rendered= Taskdata.subtitle || '';
		wpTasks.acf.Estimated_time=Taskdata.estimatedTimeSeconds
		wpTasks.acf.max_time=Taskdata.estimatedTimeSeconds
		wpTasks.acf.image.url=Taskdata.picture_url
		wpTasks.acf.image.link=Taskdata.picture_url
		wpTasks.acf.audio.url=Taskdata.audio_url
		wpTasks.acf.audio.link=Taskdata.audio_url
		wpTasks.acf.sub_tasks=Taskdata.subtasks

		// ----places/sites---
		Taskdata.sites.map(async (taskId) => {
			wpTasks.places.push(taskId.id)
		})
		
		nodeTasksdata.push({ ...wpTasks })
	})
	console.log("nodeTasksdata", nodeTasksdata);
	return nodeTasksdata
}