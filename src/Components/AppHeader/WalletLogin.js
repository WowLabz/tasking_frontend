import React from 'react'
import { Nav , NavDropdown} from "react-bootstrap";

const { ApiPromise, WsProvider } = require('@polkadot/api');
import {
	isWeb3Injected,
	web3Accounts,
	web3Enable,
	web3FromAddress
} from "@polkadot/extension-dapp";
web3Enable('polkadot-js/apps');

import Web3 from "web3";

const WalletLogin = () => {

    const loginToMath = async () => {
       if (!isWeb3Injected) {
			throw new Error("Please install/unlock the MathWallet first");
		}
		// meta.source contains the name of the extension that provides this account
		const allAccounts = await web3Accounts();
        console.log(`allAccounts : ${JSON.stringify(allAccounts)}`);

       // Initialise the provider to connect to the local node
		const provider = new WsProvider("wss://marketplace.wowlabz.com");
		// Create the API and wait until ready
		const api = await ApiPromise.create({ provider });
 
        const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
        api.query.system.account(ALICE, balance => {
            console.log(balance.data.free.toHuman());
        });

		return allAccounts; 
    } 

    const loginToGuarda = async () => {
        // Use Guarda provider
        if (window.guarda) {
            let wallets = window.guarda.wallets;
            let dotWallet = wallets.filter(wallet => wallet.currency === "dot");
            let walletBalance = dotWallet[0].balance;
            console.log(dotWallet[0]);
            console.log(walletBalance);
        } else {
            alert("Install Guarda Wallet Extension");
        }
    }

    return (
        <NavDropdown
            title="Wallets"
            id="collasible-nav-dropdown"
            style={{ border: "1px solid grey", marginRight: "15px"}}
        >
            <NavDropdown.Item onClick={loginToMath}>
                Math
            </NavDropdown.Item>
            <NavDropdown.Item onClick={loginToGuarda}>
                Guarda
            </NavDropdown.Item>
            <NavDropdown.Item target="_blank" href="https://guarda.co/app/send?amount=0.001&currencyFrom=dot&addressTo=1BZS3jJSCQRJiZJUaaS9t2yYv32nJ4NYcQ">
                Pay with guarda
            </NavDropdown.Item> 
        </NavDropdown>
    )
}

export default WalletLogin