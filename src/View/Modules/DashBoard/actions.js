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