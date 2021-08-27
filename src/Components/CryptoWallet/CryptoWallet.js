import {
    web3FromSource,
    web3Accounts,
    web3Enable,
} from "@polkadot/extension-dapp";
const { ApiPromise, WsProvider } = require('@polkadot/api');
import React, { useEffect, useState } from "react";
import { NavDropdown, Image } from "react-bootstrap";
import {
    GUARDA_WALLET_ICON,
    MATH_WALLET_ICON,
    POLKA_WALLET_ICON,
} from "../../constants/constants";
import { getAccountBalance } from "../../palletTaskingFunctions";
import { useSubstrate } from "../../substrate-lib";
import { WALLET_NAME } from "./constants";

const connectWalletStyle = {
    border: "1px solid #f2f4f6",
    borderRadius: "12px",
    // boxShadow: "4px 4px 4px rgb(151 167 195 / 44%), -4px -4px 4px #f2f4f660"
};

const CryptoWallet = () => {
    const [accBalances, setAccBalances] = useState({
        polka: "",
        math: "",
        guarda: ""
    });
    const [accounts, setAccounts] = useState(null);
    const { api, keyring } = useSubstrate();

    const getAccounts = async () => {
        const extensions = await web3Enable("dot_marketplace");
        console.log(`extensions: ${JSON.stringify(extensions)}`);

        const allAccounts = await web3Accounts();
        setAccounts([...allAccounts]);
        console.log("---------1------------");
        console.log(`allAccounts: ${JSON.stringify(allAccounts)}`);

        const account = allAccounts[0];

        
        const injector = await web3FromSource(WALLET_NAME.polkadotjs);
        console.log(`injector: ${JSON.stringify(injector)}`);
    };
    
    const DEFAULT_ACCOUNT_IDS = {
        ALICE: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        BOB: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    };
    
    const onPolkaWalletClick = async () => {
        console.log("polka");
        console.log("------------2-------------");
        let accInfo = getAccountIdByWalletName(WALLET_NAME.polkadotjs);
        let balance = getBalance(accInfo.address);
        console.log(accInfo);
        console.log(balance);
        console.log("------------3-------------");
    };
    
    const onMathWalletClick = async () => {
        console.log("math");
        // let accInfo = getAccountIdByWalletName(WALLET_NAME.math);
        // let balance = await getAccountBalance(api, accInfo.address);
    };
    
    const onGuardaWalletClick = async () => {
        console.log("gurada");
        // let accInfo = getAccountIdByWalletName(WALLET_NAME.guarda);
        // let balance = await getAccountBalance(api, accInfo.address);
    };
    
    const getAccountIdByWalletName = (walletName) => {
        let matchedAccount;
        accounts.forEach((acc) => {
            if (acc.meta.source === walletName) {
                console.log(acc);
                matchedAccount = acc;
            }
        });
        return matchedAccount;
    };

    const getBalance = async (address) => {
        let accBal;
        // Initialise the provider to connect to the local node
		const provider = new WsProvider("wss://marketplace.wowlabz.com");
		// Create the API and wait until ready
		const api = await ApiPromise.create({ provider });
        
        api.query.system.account(address, balance => {
            accBal = balance.data.free.toHuman()
            setAccBalances({...accBalances, polka: accBal});
            console.log(balance.data.free.toHuman());
        });
        return accBal;
    }
    
    useEffect(() => {
        getAccounts();
    }, []);
    
    return (
        <NavDropdown
            title={`Connect Wallet`}
            id="collasible-nav-dropdown"
            style={connectWalletStyle}
            className="m-1"
        >
            <NavDropdown.Item href="#action/3.1" onClick={onPolkaWalletClick}>
                <Image
                    src={POLKA_WALLET_ICON}
                    width="28"
                    height="28"
                    alt="PolkaWalletLogo"
                    roundedCircle
                    className="p-1 m-1"
                    />
                Polkadot-js
                {accBalances.polka !== "" && <small>{`  ${accBalances.polka}`}</small>}
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2" onClick={onMathWalletClick}>
                <Image
                    src={MATH_WALLET_ICON}
                    width="28"
                    height="28"
                    alt="MathWalletLogo"
                    roundedCircle
                    className="p-1 m-1"
                    />
                Math Wallet
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2" onClick={onGuardaWalletClick}>
                <Image
                    src={GUARDA_WALLET_ICON}
                    width="28"
                    height="28"
                    alt="GuardaWalletLogo"
                    roundedCircle
                    className="p-1 m-1"
                />
                Guarda Wallet
            </NavDropdown.Item>
        </NavDropdown>
    );
};

export default CryptoWallet;

// test data
// const extensions = [
//     {
//         name: "mathwallet",
//         version: "2.0.0",
//         originName: "dot_marketplace",
//         isMathWallet: true,
//         accounts: {},
//         signer: {},
//     },
//     {
//         name: "polkadot-js",
//         version: "0.38.3",
//         accounts: {},
//         metadata: {},
//         provider: {},
//         signer: {},
//     },
// ];
// const allAccounts = [
//     {
//         address: "5E9qirdixDapJ4Z4JBZD4cpcR65NNbUbW4ScaXdrjLEVcScZ",
//         meta: {
//             genesisHash: "",
//             name: "wowlabz_test",
//             source: "polkadot-js",
//         },
//     },
// ];
