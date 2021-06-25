import { composeWithDevTools } from "redux-devtools-extension";
import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";

import rootReducer from "./reducer";

const persistConfig = {
    key: "root",
    storage,
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
