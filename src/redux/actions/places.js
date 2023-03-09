import { PLACES_CHANGE, VISIT_PLACE } from "../constants";
export function changePlaces(user_places, currentDate) {
  console.log("user_places", user_places);
  return {
    type: PLACES_CHANGE,
    payload: { user_places, currentDate },
  };
}

export function visitPlaces(placeID) {
  console.log("placeID: ", placeID);
  return {
    type: VISIT_PLACE,
    payload: placeID,
  };
}
