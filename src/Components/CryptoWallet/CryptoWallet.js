import React, { useEffect, useState } from 'react';
import { NavDropdown, Image } from 'react-bootstrap';
import Keyring from '@polkadot/keyring';
import {
  web3FromSource,
  web3Accounts,
  web3Enable,
} from '@polkadot/extension-dapp';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { cryptoWaitReady } from '@polkadot/util-crypto';
import {
  GUARDA_WALLET_ICON,
  MATH_WALLET_ICON,
  POLKA_WALLET_ICON,
  TEST_WALLET_ICON,
} from '../../constants/constants';
import { getAccountBalance } from '../../palletTaskingFunctions';
import { useSubstrate } from '../../substrate-lib';
import { WALLET_NAME } from './constants';
import { useDispatch } from 'react-redux';
import {
  cryptoWalletConnection,
  cryptoWalletDisconnect,
  cryptoWalletError,
  testWalletConnection,
} from '../AppHeader/actions';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
toast.configure();

const connectWalletStyle = {
  border: '1px solid #f2f4f6',
  borderRadius: '12px',
  // boxShadow: "4px 4px 4px rgb(151 167 195 / 44%), -4px -4px 4px #f2f4f660"
};

const CryptoWallet = () => {
  const [accounts, setAccounts] = useState(null);
  const [accBalances, setAccBalances] = useState(null);
  const dispatch = useDispatch();

  const getAccounts = async () => {
    try {
      // Extentsion
      await web3Enable('dot_marketplace');
      let allAccounts = await web3Accounts();

      allAccounts = allAccounts.map(({ address, meta }) => {
        return {
          address,
          meta: { ...meta, name: `${meta.name}` },
        };
      });

      setAccounts([...allAccounts]);

    } catch (error) {
      dispatch(cryptoWalletError(error));
      toast.error(`Connect to Polkadot-js Extension`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const DEFAULT_ACCOUNT_IDS = {
    ALICE: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
    BOB: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
  };

  const onTestWalletClick = () => {
    dispatch(testWalletConnection());
  };

  const onPolkaWalletClick = async () => {
    try {
      if (accounts.length == 0) {
        throw Error('No wallets connected');
      }

      let polkaAccounts = accounts?.filter(
        (acc) => acc.meta.source === WALLET_NAME.polkadotjs
      );
      dispatch(cryptoWalletConnection(polkaAccounts));

      toast.info(`Polkadot Wallet Connected`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    } catch (error) {
      dispatch(cryptoWalletDisconnect());
      let errorToast;
      if (error.message === 'No wallets connected') {
        errorToast = `Connect to Polkadot-js Extension`;
      } else {
        errorToast = `Error: ${error.message}`;
      }
      toast.error(errorToast, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000,
      });
    }
  };

  const onMathWalletClick = async () => {
    toast.warn(`Feature Coming Soon`, {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 2000,
    });
    // let accInfo = getAccountIdByWalletName(WALLET_NAME.math);
    // let balance = await getAccountBalance(api, accInfo.address);
  };

  const onGuardaWalletClick = async () => {
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
      //   setAccBalances({ ...accBalances, polka: accBal });
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
      <NavDropdown.Item onClick={onTestWalletClick}>
        <Image
          src={TEST_WALLET_ICON}
          width="28"
          height="28"
          alt="TestWalletLogo"
          roundedCircle
          className="p-1 m-1"
        />
        Test Wallet
      </NavDropdown.Item>
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
