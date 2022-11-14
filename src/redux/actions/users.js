import * as types from '../constants';
export function changeUser(user) {
    return {
        type: types.USER_CHANGE,
        payload: user
    }
}

export function enterApp(date) {
    return {
        type: types.ENTER_APP,
        payload: date
    }
}