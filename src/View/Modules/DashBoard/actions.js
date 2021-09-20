import * as CONSTANTS from './constants';

/**
 * Get available tasks
 */
 export const setTasks = (data) => {
    return {
        type: CONSTANTS.GET_TASKS,
        payload: data,
    };
}

/**
 * Set the attributes for tasks required for the cards
 */
export const setAttributiesForTaskCard = (data) => {
    return {
        type: CONSTANTS.ATTRIBUTES_FOR_TASK_CARD,
        payload: data
    }
}