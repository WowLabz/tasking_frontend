import React from "react";
import { Container, Nav, Navbar, NavDropdown, Image } from "react-bootstrap";

import * as constants from "../../constants/constants";
import {
    TxGroupButton,
    TxButton,
} from "../../substrate-lib/components/TxButton";
import CryptoWallet from "../CryptoWallet/CryptoWallet";
import "./AppHeader.css";
import { FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../View/Modules/Authorization/actions";
import { useHistory } from "react-router";
import ConnectedAccounts from "./ConnectedAccounts";

const AppHeader = () => {
    const isLoggedIn = useSelector(
        (state) => state.authenticationReducer.isLoggedIn
    );
    const isWalletConnected = useSelector(
        (state) => state.headerReducer.isWalletConnected
    );
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = (e) => {
        dispatch(signOut());
    };
    return (
        <Navbar
            fixed="top"
            collapseOnSelect
            expand="lg"
            bg="dark"
            variant="dark"
        >
            <Container>
                <Navbar.Brand href="/">
                    <Image
                        src={constants.APP_LOGO}
                        alt="MarketPlaceLogo"
                        width="60"
                        height="40"
                        roundedCircle
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav>
                        <Nav.Link>Open</Nav.Link>
                        <Nav.Link>Approve</Nav.Link>
                        <Nav.Link>InProgress</Nav.Link>
                        <Nav.Link>Completed</Nav.Link>
                    </Nav>
                    <Nav style={{ marginLeft: "auto" }}>
                        {/* <Nav.Link href="#Approve">Open</Nav.Link>
                        <Nav.Link href="#Approve">Approve</Nav.Link>
                        <Nav.Link href="#InProgress">InProgress</Nav.Link>
                        <Nav.Link href="#InProgress">Completed</Nav.Link> */}
                        {/* <TxButton
                            label="Signed"
                            type="SIGNED-TX"
                            color="blue"
                            {...props}
                        /> */}
                        {!isWalletConnected && <CryptoWallet />}
                        {isWalletConnected && <ConnectedAccounts />}
                        <NavDropdown
                            title={
                                <FaSignOutAlt
                                    style={{
                                        fill: "white",
                                        width: "20",
                                        height: "20",
                                    }}
                                />
                            }
                            id="collasible-nav-dropdown"
                            style={{ margin: "auto" }}
                        >
                            <NavDropdown.Item onClick={handleLogout}>
                                Logout
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    {/* <Nav className="ml-auto">
                        <Nav.Link href="#deets">More</Nav.Link>
                        <Nav.Link eventKey={2} href="#memes">
                            Dank memes
                        </Nav.Link>
                    </Nav> */}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppHeader;
