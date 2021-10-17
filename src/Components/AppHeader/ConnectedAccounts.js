import React, { useEffect, useState } from "react";
import { NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAccountsFromKeyRing } from "../../palletTaskingFunctions";
import { useSubstrate } from "../../substrate-lib";
import { cryptoWalletAccountSelect, cryptoWalletDisconnect } from "./actions";

const connectWalletStyle = {
    border: "1px solid #f2f4f6",
    borderRadius: "12px",
    minWidth: "7vw"
    // boxShadow: "4px 4px 4px rgb(151 167 195 / 44%), -4px -4px 4px #f2f4f660"
};

const ConnectedAccounts = () => {
    const connectedAccounts = useSelector(
        (state) => state.headerReducer.accountsAvailableInWallet
    );
    const defaultAccounts = useSelector(
        (state) => state.headerReducer.defaultAccounts
    );
    const dispatch = useDispatch();
    const [accountName, setAccountName] = useState("Select Account");

    const handleAccountSelect = (e, acc) => {
        setAccountName(acc.meta.name);
        dispatch(cryptoWalletAccountSelect(acc));
    };

    return (
        <NavDropdown
            title={accountName}
            id="collasible-nav-dropdown"
            style={connectWalletStyle}
            className="m-1"
        >
            {[...connectedAccounts, ...defaultAccounts]?.map((acc, index) => (
                <NavDropdown.Item
                    key={index}
                    onClick={(e) => handleAccountSelect(e, acc)}
                >
                    {acc.meta.name}
                </NavDropdown.Item>
            ))}
            <NavDropdown.Item
                onClick={() => {
                    dispatch(cryptoWalletDisconnect());
                }}
            >
                Switch Wallet
            </NavDropdown.Item>
        </NavDropdown>
    );
};

export default ConnectedAccounts;
