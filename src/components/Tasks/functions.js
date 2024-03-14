
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
    if (!!text && text.split('<p>')[1]) {
        const cleanText = text.split('<p>')[1].split('</p>')[0]
        return cleanText.replaceAll("&#8217;", "'").replaceAll("&#8211;", "-")
    }
    return (text || '').replaceAll("&#8217;", "'").replaceAll("&#8211;", "-")
}

export const getTimeInUTC = () => {
    let date = new Date();

    // Extract individual components
    let year = date.getUTCFullYear();
    let month = String(date.getUTCMonth() + 1).padStart(2, '0');
    let day = String(date.getUTCDate()).padStart(2, '0');
    let hours = String(date.getUTCHours()).padStart(2, '0');
    let minutes = String(date.getUTCMinutes()).padStart(2, '0');
    let seconds = String(date.getUTCSeconds()).padStart(2, '0');
    let milliseconds = String(date.getUTCMilliseconds()).padStart(3, '0');

    // Construct the desired format
    let utcFormattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}Z`;
    return utcFormattedDate
}

export const getTimeDifferenceInSeconds = (time1, time2) => {
    // Parse the timestamps into Date objects
    let date1 = new Date(time1);
    let date2 = new Date(time2);

    let timeStart = date1.getUTCSeconds();
    let timeEnd = date2.getUTCSeconds();

    // Calculate the difference between the two times in seconds
    let timeDifferenceInSeconds = Math.abs(timeEnd - timeStart);

    return timeDifferenceInSeconds;
}