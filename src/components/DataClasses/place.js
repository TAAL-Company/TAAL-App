
// const nodePlacesData = PlacesData
// .map(Places => ({...wpPlaceSample, ...wpPlaceFromNoPlace(Places)})

const wpPlaceFromNoPlace = (noPlace) => {
  // extra code if needed
  return ({
    id: noPlace.id,
    name: noPlace.name,
    description: noPlace.description,
    acf: {
      image: {
        link: noPlace.picture_url || "",
        url: noPlace.picture_url || "",
      },
      audio: {
        link: noPlace.audio_url || "",
        url: noPlace.audio_url || "",
      },
      qr: {
        url: noPlace.qr_code_url || "",
        link: noPlace.qr_code_url || ""
      }
    }
  });
}

const wpPlaceSample = {
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