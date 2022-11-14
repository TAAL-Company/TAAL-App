/**
 * Create an object with keys as id
 * @param  {Array} list array of objects
 * @return {Object}     Object of objects with keys as IDs
 */
export const createCopy = (list) => {
    let newList = {}
    list.forEach(item => {
        newList[item.id] = item
    });
    return newList
}

export const markTaskAsCompletedOrNot = (currentTaskList, allTasksList, id, index) => {
    currentTaskList[index].didFinish = true
    allTasksList.forEach((curTask, index2) => {
        if (curTask.id === id) {
            allTasksList[index2].didFinish = true
        }
    });
}