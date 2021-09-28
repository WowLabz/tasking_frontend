import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DashBoard from "./View/Modules/DashBoard/DashBoard";
import Authorization from "./View/Modules/Authorization/Authorization";
import TaskDetails from "./View/Modules/TaskDetails/TaskDetails";
import AppHeader from "./Components/AppHeader/AppHeader";
import { Container } from "react-bootstrap";
import AppFooter from "./Components/AppFooter/AppFooter";
import "./View/Modules/DashBoard/Dashboard.css";
import { useSelector } from "react-redux";

const Routes = () => {
    const isLoggedIn = useSelector(
        (state) => state.authenticationReducer.isLoggedIn
    );

    return (
        <>
            {!isLoggedIn ? (
                <Router>
                    <Switch>
                        <Route path="/" component={Authorization} />
                    </Switch>
                </Router>
            ) : (
                <>
                    <AppHeader />
                    <Container
                        className="dashboard-container"
                        style={{ marginTop: "50px", marginBottom: "30px" }}
                    >
                        <Router>
                            <Switch>
                                <Route exact path="/" component={DashBoard} />
                                <Route
                                    exact
                                    path="/dashboard"
                                    component={DashBoard}
                                />
                                <Route
                                    exact
                                    path="/auth"
                                    component={Authorization}
                                />
                                <Route
                                    path="/taskdetails/:id"
                                    component={TaskDetails}
                                />
                            </Switch>
                        </Router>
                    </Container>
                    <AppFooter />
                </>
            )}
        </>
    );
};

export default Routes;
