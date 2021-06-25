import * as Actions from "./actions";

export const setTasksFromBackEnd = (data) => {
    return async (dispatch) => {
        try {
            dispatch(Actions.setTasks(data));
        } catch (error) {
            console.log(`err from actionCreator ${err}`);
        }
    };
};
