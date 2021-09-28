export const USERTYPE = {
    CUSTOMER: "Customer",
    WORKER: "Worker" 
}

export const SIGN_IN = "SIGN_IN"
export const SIGN_UP = "SIGN_UP"
export const SIGN_OUT = "SIGN_OUT"
export const INITIATING_API_CALL = "INITIATING_API_CALL"
export const API_CALL_ERROR = "API_CALL_ERROR"
export const API_CALL_SUCCESS = "API_CALL_SUCCESS"

// export const AUTH_BASE_URL = "http://localhost:3001"
console.log(process.env);
export const AUTH_BASE_URL = process.env.REACT_APP_AUTH_SERVER;
console.log(AUTH_BASE_URL);
export const AUTH_END_POINTS = {
    signUp: "/auth/sign-up",
    signIn: "/auth/sign-in"
}