import React, { useState, useEffect } from "react";
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
import { useSubstrateState } from "./substrate-lib";
import { useDispatch } from "react-redux";
import { getAllProjects } from "./palletTaskingFunctions";
import * as actionCreators from "./View/Modules/DashBoard/actionCreators";

const Routes = ({ match }) => {

    // This will keep on fetching the latest projects and all details from the backend every 5 seconds
    // Fetching logic begins here 
    const [ caller, setCaller ] = useState(false);

    const { api } = useSubstrateState();
    const dispatch = useDispatch(); 

    const init = async () => {
        try{
            const getProjectResult = await getAllProjects(api);
            if(getProjectResult){
                dispatch(actionCreators.setTasksFromBackEnd(getProjectResult));
            }
        }catch(error){
            console.log(`got some error ${error.stack}`);
        }
    }

    useEffect(() => {
        if(api) {
            init();
            if(caller === false) {
                setInterval(() => {
                    init();
                },5000);
                setCaller(true);
            }
        }
    },[api?.query.palletTasking]);

    // Fetching logic ends here 

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
