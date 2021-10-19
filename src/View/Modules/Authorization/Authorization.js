import React, { useEffect, useState } from "react";
import { Card, Nav, Tab, Row, Col } from "react-bootstrap";
import LoginFormFormik from "./LoginFormFormik";
import RegistrationFormFormik from "./RegistrationFormFormik";
import logo from "../../../assets/images/market-place-logo.png";
import { getUserTags } from "./actionCreators";
import { useDispatch } from "react-redux";

const PageContainer = {
    minHeight: "100vh",
    backgroundColor: "#272b41",
    opacity: "1"
};

const AuthContainer = {
    height: "600px",
    width: "700px",
};

const FixedCardHeight = {
    height: "600px",
}


const Authorization = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserTags());
        return () => {
        }
    }, [])

    return (
        <>
            <div
                style={PageContainer}
                className="col d-flex justify-content-center align-items-center"
            >
                <div style={AuthContainer}>
                    <Tab.Container
                        id="left-tabs-example"
                        defaultActiveKey="first"
                    >
                        <Row>
                            <Col sm={4}>
                                <Card style={{...FixedCardHeight}}>
                                    <Card.Img variant="top" src={logo} />
                                    <Card.Body>
                                        <Nav
                                            variant="pills"
                                            className="flex-column text-center"
                                        >
                                            <Nav.Item>
                                                <Nav.Link eventKey="first">
                                                    Sign In
                                                </Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item>
                                                <Nav.Link eventKey="second">
                                                    Sign Up
                                                </Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col sm={8}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">
                                        <LoginFormFormik />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">
                                        <RegistrationFormFormik />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>
            </div>
        </>
    );
};

export default Authorization;
