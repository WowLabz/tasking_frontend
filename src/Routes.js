import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DashBoard from "./View/Modules/DashBoard/DashBoard";
import Authorization from "./View/Modules/Authorization/Authorization";
import TaskDetails from "./View/Modules/TaskDetails/TaskDetails";
import "./View/Modules/DashBoard/Dashboard.css";
import ProtectedRoute from "./ProtectedRoutes";

const Routes = ({ match }) => {
    return (
        <>
            <Router>
                <Switch>
                    <Route exact path="/auth" component={Authorization} />
                    <ProtectedRoute exact path="/" component={DashBoard} />
                    <ProtectedRoute
                        path="/taskdetails/:id"
                        component={TaskDetails}
                    />
                </Switch>
            </Router>
        </>
    );
};

export default Routes;