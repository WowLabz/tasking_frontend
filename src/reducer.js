import { combineReducers } from "redux";

import { dashBoardReducer } from "./View/Modules/DashBoard/reducer";

const rootReducer = combineReducers({
    dashBoardReducer,
});

export default rootReducer;
