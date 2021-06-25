import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import "bootstrap/dist/css/bootstrap.min.css";

import App from "./App";
import configureStore from "./store";
import "./constants/colors.css";
import "./constants/constants.css";

const { store, persistor } = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </Provider>,
    document.getElementById("root")
);
