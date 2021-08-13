import { apiCallError, initiatingApiCall, signIn } from "./actions";
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
            if (res.status === "200") {
                dispatch(signIn(res.data));
                toast.success("Login Successfull !", {
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
            if (res.status === "200") {
                dispatch(signIn(res.data));
                toast.success("Login Successfull !", {
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
