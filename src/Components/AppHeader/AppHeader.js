import React from "react";
import {
    Container,
    Nav,
    Navbar,
    NavDropdown,
    Image,
} from "react-bootstrap";

import * as constants from "../../constants/constants";
import CryptoWallet from "../CryptoWallet/CryptoWallet";
import "./AppHeader.css";
import { FaSignOutAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../View/Modules/Authorization/actions";
import ConnectedAccounts from "./ConnectedAccounts";

const AppHeader = () => {
    const isWalletConnected = useSelector(
        (state) => state.headerReducer.isWalletConnected
    );
    const dispatch = useDispatch();

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
                    {/* <SortTasks /> */}
                    <Nav>
                        {/* <NavDropdown
                            title={"Sort Tasks By"}
                            id="collasible-nav-dropdown"
                        >
                            {Object.values(SORT_BY).map((val) => (
                                <NavDropdown.Item>{val}</NavDropdown.Item>
                            ))}
                        </NavDropdown> */}
                    </Nav>
                    <Nav style={{ marginLeft: "auto" }}>
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
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default AppHeader;
