import * as type from '../constants';
import { createCopy, markTaskAsCompletedOrNot } from './functions'


const initialState = {
    user_tasks: [],
    task_location: null,
    current_tasks: [],
    current_tasks_list: [],
    task_current_index: null,
    currentDate: "",
};



const tasksReducer = (state = initialState, action) => {
    switch (action.type) {
        case type.TASKS_CHANGE:
            let newTasksList = []
            let objList = createCopy(state.user_tasks)

            const dateHasChanged = (state.currentDate < action.payload.currentDate)
            action.payload.user_tasks.forEach(element => {
                if (objList.hasOwnProperty(element.id)) {
                    if (dateHasChanged)
                        objList[element.id]["didFinish"] = null

                    newTasksList.push(objList[element.id])
                }
                else {
                    element["didFinish"] = null
                    newTasksList.push(element)
                }
            });

            return {
                ...state,
                user_tasks: newTasksList,
                currentDate: action.payload.currentDate,
                task_location: null

            };
        case type.TASKS_ADD:
            let currentTaskList = [...state.user_tasks]
            Object.assign(currentTaskList, action.payload)
            return {
                ...state,
                user_tasks: currentTaskList
            };

        case type.CURRENT_SITE_TASKS:
            let currentTaskName = action.payload[0][0].title.rendered
            return {
                ...state,
                current_tasks: action.payload,
                task_location: currentTaskName
            };

        case type.COMPLETE_TASK:
            let currentTaskListt = [...state.current_tasks_list]
            let allTasksList = [...state.user_tasks]

            markTaskAsCompletedOrNot(currentTaskListt, allTasksList, action.payload.id, action.payload.index)

            return {
                ...state,
                current_tasks_list: currentTaskListt,
                user_tasks: allTasksList,
            };

        case type.CHANGE_TASK_NAME:
            return {
                ...state,
                task_current_index: action.payload.currentTaskIndex,
                task_location: action.payload.currentTaskName,
            };

        case type.CURRENT_SITE_TASKS_LIST:
            const firstTask = action.payload[0] ? action.payload[0].title.rendered : ''
            return {
                ...state,
                current_tasks_list: action.payload,
                task_current_index: 0,
                task_location: firstTask
            };
        default:
            return state;
    }
}
export default tasksReducer;