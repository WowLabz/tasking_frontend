import React, { useEffect } from "react";
import { NavDropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getAccountsFromKeyRing } from "../../palletTaskingFunctions";
import { useSubstrate } from "../../substrate-lib";
import { cryptoWalletAccountSelect, cryptoWalletDisconnect } from "./actions";

const connectWalletStyle = {
    border: "1px solid #f2f4f6",
    borderRadius: "12px",
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

    const handleAccountSelect = (e, acc) => {
        dispatch(cryptoWalletAccountSelect(acc));
    };

    useEffect(() => {
        // let BobFromKeyRing = keyring.getAccount(
        //     palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.BOB
        // );
        // let AliceFromKeyRing = keyring.getAccount(
        //     palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.ALICE
        // );
        // let bob = keyring.getPair(BobFromKeyRing.address);
        // let alice = keyring.getPair(AliceFromKeyRing.address);
        // console.log(bob);
        // console.log(alice);
    }, []);
    return (
        <NavDropdown
            title={`Connected Wallet`}
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
