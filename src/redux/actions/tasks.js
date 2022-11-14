import {
  TASKS_CHANGE,
  TASKS_ADD,
  CURRENT_SITE_TASKS,
  COMPLETE_TASK,
  CHANGE_TASK_NAME,
  CURRENT_SITE_TASKS_LIST,
} from "../constants";

export function changeTasks(user_tasks, currentDate) {
  return {
    type: TASKS_CHANGE,
    payload: { user_tasks, currentDate },
  };
}

export function addTasks(user_tasks) {
  return {
    type: TASKS_ADD,
    payload: user_tasks,
  };
}

export function changeCurrentTasks(current_tasks) {
  return {
    type: CURRENT_SITE_TASKS,
    payload: current_tasks,
  };
}

export function changeCurrentTasksList(current_tasks_list) {
  return {
    type: CURRENT_SITE_TASKS_LIST,
    payload: current_tasks_list,
  };
}

export function completeTask(currentTaskId, index) {
  return {
    type: COMPLETE_TASK,
    payload: { id: currentTaskId, index },
  };
}

export function changeCurrentTask(currentTaskName, currentTaskIndex) {
  return {
    type: CHANGE_TASK_NAME,
    payload: { currentTaskName, currentTaskIndex },
  };
}
