import { API_CALL_ERROR, API_CALL_SUCCESS, INITIATING_API_CALL, SIGN_IN, SIGN_OUT, SIGN_UP } from "./constants"

export const signIn = (data) => {
    return {
        type: SIGN_IN,
        payload: data
    }
}

export const signOut = () => {
    return {
        type: SIGN_OUT
    }
}

export const signUp = (data) => {
    return {
        type: SIGN_UP,
    }
}

export const initiatingApiCall = () => {
    return {
        type: INITIATING_API_CALL
    }
}

export const apiCallError = (data) => {
    return {
        type: API_CALL_ERROR,
        payload: data
    }
}

export const apiCallSuccess = () => {
    return {
        type: API_CALL_SUCCESS
    }
}