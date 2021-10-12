import { combineReducers } from "redux";

import { dashBoardReducer } from "./View/Modules/DashBoard/reducer";
import { authenticationReducer } from "./View/Modules/Authorization/reducer";
import { headerReducer } from "./Components/AppHeader/reducer";

const rootReducer = combineReducers({
    dashBoardReducer,
    authenticationReducer,
    headerReducer
});

export default rootReducer;
