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
            if (res.status === 200) {
                dispatch(signIn(res.data.data));
                toast.success("Login Successfull !", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                });
            } else {
                toast.error("Login Failed! Try again!", {
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
            console.log(res);
            if (res.status === 200) {
                window.location.reload();
                toast.success("Registration Successfull !", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                });
                toast.success("SignIn to App!", {
                    position: toast.POSITION.TOP_LEFT,
                    autoClose: 5000,
                });
            } else {
                console.log("------------1-----------");
                toast.error("Registration Failed!", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 3000,
                });
            }
        } catch (error) {
            console.log("------------2-----------");
            dispatch(apiCallError());
            toast.error(error.message, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 3000,
            });
        }
    };
};
