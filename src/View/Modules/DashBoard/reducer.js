import {
    ATTRIBUTES_FOR_TASK_CARD,
    GET_TASKS,
    SORTING_OPTIONS,
    SORT_BY,
} from "./constants";

const initialState = {
    api: null,
    keyringAccounts: null,
    tasks: [],
    sortBy: SORT_BY.userTags,
};

export const dashBoardReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_TASKS:
            return {
                ...state,
                tasks: action.payload,
            };
        case ATTRIBUTES_FOR_TASK_CARD:
            return {
                ...state,
                tasks: action.payload,
            };
        case SORTING_OPTIONS:
            return {
                ...state,
                sortBy: action.payload,
            };
        default:
            return state;
    }
};
