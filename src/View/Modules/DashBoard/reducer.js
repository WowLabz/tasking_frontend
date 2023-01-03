import {
    ATTRIBUTES_FOR_TASK_CARD,
    GET_TASKS,
    SORTING_OPTIONS,
    SORT_BY,
    GET_PROJECTS,
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
            console.log(`action.payload ${action.payload}`);
            return {
                ...state,
                tasks: [...action.payload],
            };
        case GET_PROJECTS:
            return {
                ...state,
                tasks: action.payload,
            }
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
