import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";

const ProtectedRoute = ({ component: Component, ...restOfProps }) => {
    const isLoggedIn = useSelector(
        (state) => state.authenticationReducer.isLoggedIn
    );

    return (
        <Route
            {...restOfProps}
            render={(props) =>
                isLoggedIn ? (
                    <Component {...props} />
                ) : (
                    <Redirect
                        to={{
                            pathname: "/auth",
                        }}
                    />
                )
            }
        />
    );
};

export default ProtectedRoute;
