import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DashBoard from "./View/Modules/DashBoard/DashBoard";
import Authorization from "./View/Modules/Authorization/Authorization";

const Routes = () => {
    return (
        <>
            <Router>
                <Switch>
                    <Route exact path="/" component={Authorization} />
                    <Route exact path="/dashboard" component={DashBoard} />
                </Switch>
            </Router>
        </>
    );
};

export default Routes;
