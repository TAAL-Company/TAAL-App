
/*
    gets the tasks seperated to stations and returns a tasks list and a stations list
*/
export const storeInitialData = (sitesTasks) => {
    let stationsObject = {}
    for (let index = 0; index < sitesTasks.length; index++) {
        if (sitesTasks[index + 1]) {
            let placeIndex = index + sitesTasks[index].length - 1
            stationsObject[placeIndex] = sitesTasks[index + 1][0].stationDetails
        }
    }
    return stationsObject
}

/* 
    Functions for a mobile version
*/
export const getLineHeight = (currentIndex) => {
    switch (currentIndex) {
        case 0:
            return 50
        default:
            return 24
    }
}

export const parseContent = (text) => {
    if (text !== "" && text.split('<p>')[1]) {
        const cleanText = text.split('<p>')[1].split('</p>')[0]
        return cleanText.replaceAll("&#8217;", "'").replaceAll("&#8211;", "-")
    }
    else
        return text.replaceAll("&#8217;", "'").replaceAll("&#8211;", "-")
}