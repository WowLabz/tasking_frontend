import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DashBoard from "./View/Modules/DashBoard/DashBoard";

const Routes = () => {
    return (
        <>
            <Router>
                <Switch>
                    <Route exact path="/" component={DashBoard} />
                </Switch>
            </Router>
        </>
    );
};

export default Routes;
