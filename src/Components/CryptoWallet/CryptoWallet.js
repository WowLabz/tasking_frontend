import {
    web3FromSource,
    web3Accounts,
    web3Enable,
} from "@polkadot/extension-dapp";
const { ApiPromise, WsProvider } = require("@polkadot/api");
import React, { useEffect, useState } from "react";
import { NavDropdown, Image } from "react-bootstrap";
import Keyring from "@polkadot/keyring";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import {
    GUARDA_WALLET_ICON,
    MATH_WALLET_ICON,
    POLKA_WALLET_ICON,
} from "../../constants/constants";
import { getAccountBalance } from "../../palletTaskingFunctions";
import { useSubstrate } from "../../substrate-lib";
import { WALLET_NAME } from "./constants";
import { useDispatch } from "react-redux";
import {
    cryptoWalletConnection,
    cryptoWalletDisconnect,
    cryptoWalletError,
} from "../AppHeader/actions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
toast.configure();

const connectWalletStyle = {
    border: "1px solid #f2f4f6",
    borderRadius: "12px",
    // boxShadow: "4px 4px 4px rgb(151 167 195 / 44%), -4px -4px 4px #f2f4f660"
};

const CryptoWallet = () => {
    const [accBalances, setAccBalances] = useState({
        polka: "",
        math: "",
        guarda: "",
    });
    const [accounts, setAccounts] = useState(null);
    const dispatch = useDispatch();

    const getAccounts = async () => {
        try {
            // Extentsion
            await web3Enable("dot_marketplace");
            let allAccounts = await web3Accounts();
            allAccounts = allAccounts.map(({ address, meta }) => ({
                address,
                meta: { ...meta, name: `${meta.name}` },
            }));
            setAccounts([...allAccounts]);

            console.log("allAccounts", allAccounts);

            // Connection to chain for balance info
            const BLOCKCHAIN_NODE_URL = process.env.REACT_APP_BLOCKCHAIN_NODE;
            const provider = new WsProvider(BLOCKCHAIN_NODE_URL);
            const api = await ApiPromise.create({ provider });

            const keyring = new Keyring({ type: "sr25519" });

            console.log("entering loop for accounts");
            allAccounts.forEach(async (acc) => {
                keyring.addFromAddress(acc.address);
                const wowTest = keyring.getPair(acc.address);
                console.log("pairs", wowTest);
                let accBal;
                // Subscribe to balance changes for our account
                const unsub = await api.query.system.account(
                    acc.address,
                    ({ nonce, data: balance }) => {
                        console.log(
                            `free balance is ${balance.free.toHuman()} with ${balance.reserved.toHuman()} reserved and a nonce of ${nonce}`
                        );
                    }
                );
            });
        } catch (error) {
            console.log(`CryproWallet Error`, error);
            dispatch(cryptoWalletError(error));
        }
    };

    const DEFAULT_ACCOUNT_IDS = {
        ALICE: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
        BOB: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    };

    const onPolkaWalletClick = async () => {
        console.log("polka Wallet");
        console.log("------------2-------------");
        try {
            if (accounts.length == 0) {
                throw Error("No wallets connected");
            }

            let polkaAccounts = accounts?.filter(
                (acc) => acc.meta.source === WALLET_NAME.polkadotjs
            );
            console.log("polkaAccounts", polkaAccounts);
            dispatch(cryptoWalletConnection(polkaAccounts));

            toast.info(`Polkadot Wallet Connected`, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        } catch (error) {
            console.log("error with polkaWallet");
            dispatch(cryptoWalletDisconnect());
            toast.error(`Error Connecting Wallet`, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    };

    const onMathWalletClick = async () => {
        console.log("math wallet");
        toast.warn(`Feature Coming Soon`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
        });
        // let accInfo = getAccountIdByWalletName(WALLET_NAME.math);
        // let balance = await getAccountBalance(api, accInfo.address);
    };

    const onGuardaWalletClick = async () => {
        console.log("gurada wallet");
        toast.warn(`Feature Coming Soon`, {
            position: toast.POSITION.TOP_RIGHT,
            autoClose: 2000,
        });
        // let accInfo = getAccountIdByWalletName(WALLET_NAME.guarda);
        // let balance = await getAccountBalance(api, accInfo.address);
    };

    const getAccountIdByWalletName = (walletName) => {
        let matchedAccount;
        accounts?.forEach((acc) => {
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
        // const provider = new WsProvider("wss://marketplace.wowlabz.com");
        const BLOCKCHAIN_NODE_URL = process.env.REACT_APP_BLOCKCHAIN_NODE;
        const provider = new WsProvider(BLOCKCHAIN_NODE_URL);
        // Create the API and wait until ready
        const api = await ApiPromise.create({ provider });

        let balRes = api.query.system.account(address, (balance) => {
            accBal = balance.data.free.toHuman();
            setAccBalances({ ...accBalances, polka: accBal });
            console.log("balance2", balance.data.free.toHuman());
            return accBal;
        });
        return balRes;
    };

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
            <NavDropdown.Item onClick={onPolkaWalletClick}>
                <Image
                    src={POLKA_WALLET_ICON}
                    width="28"
                    height="28"
                    alt="PolkaWalletLogo"
                    roundedCircle
                    className="p-1 m-1"
                />
                Polkadot-js
                {accBalances.polka !== "" && (
                    <small>{`  ${accBalances.polka}`}</small>
                )}
            </NavDropdown.Item>
            <NavDropdown.Item onClick={onMathWalletClick}>
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
            <NavDropdown.Item onClick={onGuardaWalletClick}>
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
