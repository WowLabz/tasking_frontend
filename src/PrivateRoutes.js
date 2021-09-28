import React from "react";
import { Redirect, Route } from "react-router";

const PrivateRoutes = ({ children, ...rest }) => {
    
    const isLoggedIn = useSelector(
        (state) => state.authenticationReducer.isLoggedIn
    );

    return (
        <Route
            {...rest}
            render={({ location }) =>
                isLoggedIn ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/auth",
                            state: { from: location },
                        }}
                    />
                )
            }
        />
    );
};

export default PrivateRoutes;