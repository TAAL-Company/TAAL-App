import { PLACES_CHANGE, VISIT_PLACE } from '../constants';
export function changePlaces(user_places, currentDate) {
    return {
        type: PLACES_CHANGE,
        payload: { user_places, currentDate }
    }
}

export function visitPlaces(placeID) {
    return {
        type: VISIT_PLACE,
        payload: placeID
    }
}