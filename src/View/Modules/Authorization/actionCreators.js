import {
    apiCallError,
    apiCallSuccess,
    initiatingApiCall,
    setUserTags,
    signIn,
} from "./actions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import apiHelpers from "../../../Utilities/axiosHelpers";
import { AUTH_BASE_URL, AUTH_END_POINTS } from "./constants";
toast.configure();

export const userSignIn = (data) => {
    return async (dispatch) => {
        try {
            dispatch(initiatingApiCall());
            let logInUrl = AUTH_BASE_URL + AUTH_END_POINTS.signIn;
            let res = await apiHelpers.post(logInUrl, data);
            if (res.status === 200) {
                dispatch(signIn(res.data.data));
                dispatch(apiCallSuccess());
                toast.success("Login Successfull!", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                });
            } else {
                toast.error(`Login Failed! Try again! ${res}`, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                });
            }
        } catch (error) {
            dispatch(apiCallError());
            toast.error(error.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
            });
        }
    };
};

export const userSignUp = (data) => {
    return async (dispatch) => {
        try {
            dispatch(initiatingApiCall());
            let signUpUrl = AUTH_BASE_URL + AUTH_END_POINTS.signUp;
            let res = await apiHelpers.post(signUpUrl, data);
            if (res.status === 200) {
                window.location.reload();
                dispatch(apiCallSuccess());
                toast.success("Registration Successfull !", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                });
                toast.success("SignIn to App!", {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000,
                });
            } else {
                toast.error(`Registration Failed! ${res}`, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                });
            }
        } catch (error) {
            dispatch(apiCallError());
            toast.error(error.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
            });
        }
    };
};

export const getUserTags = () => {
    return async (dispatch) => {
        try {
            dispatch(initiatingApiCall());
            let url = AUTH_BASE_URL + AUTH_END_POINTS.getUserTags;
            let res = await apiHelpers.get(url);
            if (res.status === 200) {
                dispatch(setUserTags(res.data.data));
                dispatch(apiCallSuccess());
            } else {
                toast.error(`App Not Connected! ${res}`, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                });
            }
        } catch (error) {
            dispatch(apiCallError());
            toast.error(error.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
            });
        }
    };
};

export const uploadFileToServer = async (file) => {
    try {
        let url = AUTH_BASE_URL + AUTH_END_POINTS.uploadFileToServer;
        let headerObj = {
            headers:  {
                "Content-Type": "multipart/form-data"
            }
        }
        let res = await apiHelpers.postWithHeaders(url, file);
        if (res.status === 200) {
            // toast.success(`One file uploaded successfully`, {
            //     position: toast.POSITION.TOP_CENTER,
            //     autoClose: 3000,
            // });
            return res.data.data
        } else {
            toast.error(`App Not Connected! ${res}`, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
            });
        }
    } catch (error) {
        toast.error(error.message, {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 3000,
        });
    }
};
