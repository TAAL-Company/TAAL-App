import { PLACES_CHANGE, VISIT_PLACE } from '../constants';
import { createCopy } from './functions'



const initialState = {
    user_places: [],
    places_location: 0,
    currentDate: "",

};
const getNewTaskLocation = (userPlaces, siteID) => {

    for (let index = 0; index < userPlaces.length; index++) {
        if (userPlaces[index]["didVisit"] !== true && userPlaces[index].id !== siteID) {
            return index
        }
    }
    return -1
}

const checkIfDateHasChanged = (originalDate, newDate) => {
    //  if(originalDate === "" || originalDate < newDate)

}

const placesReducer = (state = initialState, action) => {
    switch (action.type) {
        case PLACES_CHANGE:
            let newPlacesList = []
            let currentPlacesLocation = state.places_location
            // reset the did visit after a day
            const dateHasChanged = (state.currentDate < action.payload.currentDate)
            let objList = createCopy(state.user_places)

            action.payload.user_places.forEach(element => {
                if (objList.hasOwnProperty(element.id)) {
                    if (dateHasChanged) {
                        objList[element.id]["didVisit"] = false
                        currentPlacesLocation = 0
                    }
                    newPlacesList.push(objList[element.id])
                }
                else {
                    element["didVisit"] = false
                    newPlacesList.push(element)
                }
            });
            return {
                ...state,
                user_places: newPlacesList,
                currentDate: action.payload.currentDate,
                places_location: currentPlacesLocation
            };

        case VISIT_PLACE:
            let newList = [...state.user_places]
            let listCopy = createCopy(newList)
            listCopy[action.payload].didVisit = true


            let newIndexLocation = getNewTaskLocation(state.user_places, action.payload)

            return {
                ...state,
                user_places: newList,
                places_location: newIndexLocation
            };
        default:
            return state;
    }
}
export default placesReducer;