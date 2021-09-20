import * as Actions from "./actions";
import * as palletTaskingFunctions from "../../../palletTaskingFunctions";

export const setTasksFromBackEnd = () => {
    return async (dispatch) => {
        try {
            palletTaskingFunctions.handleOnChainEvents(api, toast);
            const getTasksResult = await palletTaskingFunctions.getAllTasks(
                api
            );
            if (getTasksResult) {
                console.log(`All Tasks From Chain: ${getTasksResult.length}`);
                dispatch(
                    Actions.setTasks([
                        ...getTasksResult.sort((a, b) => b.task_id - a.task_id),
                    ])
                );
            }
        } catch (error) {
            console.log(`err from actionCreator ${err}`);
        }
    };
};
