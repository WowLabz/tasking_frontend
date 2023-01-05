import * as Actions from "./actions";

export const setTasksFromBackEnd = (data) => {
  console.log("set task from backend is called dispatching.......", data);
  return async (dispatch) => {
    try {
      dispatch(Actions.setProjects(data));
    } catch (error) {
      console.log(`err from actionCreator ${error}`);
    }
  };
};
