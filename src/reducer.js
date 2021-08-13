import { combineReducers } from "redux";

import { dashBoardReducer } from "./View/Modules/DashBoard/reducer";
import { authenticationReducer } from "./View/Modules/Authorization/reducer";

const rootReducer = combineReducers({
    dashBoardReducer,
    authenticationReducer,
});

export default rootReducer;
