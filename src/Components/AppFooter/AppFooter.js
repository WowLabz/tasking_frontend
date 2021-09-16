import React from "react";
import {
    Container,
    Nav,
    Navbar,
    NavDropdown,
    Image,
    Button,
} from "react-bootstrap";

import * as constants from "../../constants/constants";
import "./AppFooter.css";
import { BsHeartFill } from "react-icons/bs";

const AppFooter = () => {
    return (
        <Navbar
            fixed="bottom"
            expand="lg"
            bg="dark"
            variant="dark"
            className="footer"
        >
            <Container>
                <Nav style={{ margin: "auto" }}>
                    <Button
                        variant="outline-dark"
                        className="expletus-sans-ff"
                        style={{ color: "white" }}
                        disabled
                    >
                        Marketplace, Built with{" "}
                        <BsHeartFill style={{ color: "red" }} /> by Wow Labz
                        Powered by, Substrate
                    </Button>
                </Nav>
            </Container>
        </Navbar>
    );
};

export default AppFooter;
