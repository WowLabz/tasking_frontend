import React from "react";
import { Badge } from "react-bootstrap";

const FormErrorMessage = (props) => {
    return (
        <>
            <div className="px-2 " style={{ display: "inline" }}>
                <Badge
                    variant="danger"
                    className="p-1"
                    style={{ color: "white", fontSize: "small" }}
                >
                    {props.children}
                </Badge>
            </div>
        </>
    );
};

export default FormErrorMessage;
