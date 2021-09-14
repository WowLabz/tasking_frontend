import { composeWithDevTools } from "redux-devtools-extension";
import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";

import rootReducer from "./reducer";
import { authenticationReducer } from "./View/Modules/Authorization/reducer";
import { dashBoardReducer } from "./View/Modules/DashBoard/reducer";

const persistConfig = {
    key: "root",
    storage,
    whitelist: [
        "dashBoardReducer",
    ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureStore() {
    let store = createStore(
        persistedReducer,
        composeWithDevTools(applyMiddleware(thunk))
    );
    let persistor = persistStore(store);
    return { store, persistor };
}
