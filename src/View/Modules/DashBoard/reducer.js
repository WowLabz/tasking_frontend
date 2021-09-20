import { ATTRIBUTES_FOR_TASK_CARD, GET_TASKS } from "./constants";

const initialState = {
    api: null,
    keyringAccounts: null,
    tasks: [],
};

export const dashBoardReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TASKS:
            console.log(`action.payload ${action.payload}`);
            return {
                ...state,
                tasks: action.payload,
            };
        case ATTRIBUTES_FOR_TASK_CARD:
            return {
                ...state,
                tasks: action.payload
            }
        default:
            return state;
    }
};
