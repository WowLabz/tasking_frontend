import * as CONSTANTS from "./constants";

/**
 * Get available tasks
 */
export const setTasks = (data) => {
  return {
    type: CONSTANTS.GET_TASKS,
    payload: data,
  };
};

/**
 * Get available projects
 */

export const setProjects = (data) => {
  return {
    type: CONSTANTS.GET_PROJECTS,
    payload: data,
  };
};

/**
 * Set the attributes for tasks required for the cards
 */
export const setAttributiesForTaskCard = (data) => {
  return {
    type: CONSTANTS.ATTRIBUTES_FOR_TASK_CARD,
    payload: data,
  };
};

export const sortingOptions = (option) => {
  return {
    type: CONSTANTS.SORTING_OPTIONS,
    payload: option,
  };
};
