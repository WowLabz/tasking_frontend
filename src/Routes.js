import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DashBoard from "./View/Modules/DashBoard/DashBoard";
import Authorization from "./View/Modules/Authorization/Authorization";
import TaskDetails from "./View/Modules/TaskDetails/TaskDetails";
import "./View/Modules/DashBoard/Dashboard.css";
import ProtectedRoute from "./ProtectedRoutes";
import Court from "./View/Modules/Court/Court";
import CreateProject from "./View/Modules/CreateProject/CreateProject";
import UserDashboard from "./View/Modules/UserDashboard/UserDashboard";
import ProjectDetails from "./View/Modules/ProjectDetails/ProjectDetails";

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
                    <ProtectedRoute
                        path="/court/:id"
                        component={Court}
                    />
                    <ProtectedRoute
                        path="/create-project"
                        component={CreateProject}
                    />
                    <ProtectedRoute 
                        path="/user"
                        component={UserDashboard}
                    />
                    <ProtectedRoute 
                        path="/projectdetails/:id"
                        component={ProjectDetails}
                    />
                </Switch>
            </Router>
        </>
    );
};

export default Routes;
