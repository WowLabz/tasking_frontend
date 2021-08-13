import { API_CALL_ERROR, API_CALL_SUCCESS, INITIATING_API_CALL, SIGN_IN, SIGN_UP } from "./constants";

const initialState = {
    isLoggedIn: false,
    currentUserName: null,
    apiCallError: null,
}

export const authenticationReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGN_IN:
            console.log(`action.payload ${action.payload}`);
            return {
                ...state,
                isLoggedIn: true,
                currentUserName: action.payload
            }
        case SIGN_UP: 
            return state;   
        case INITIATING_API_CALL: 
            return state;
        case API_CALL_ERROR:
            return {
                ...state,
                apiCallError: action.payload
            };
        case API_CALL_SUCCESS:
            return state;
        default:
            return state;
    }
}