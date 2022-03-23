import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, FormControl, NavDropdown } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {
  DEFAULT_ACCOUNT_IDS,
  getAccountsFromKeyRing,
} from '../../palletTaskingFunctions';
import { useSubstrateState } from '../../substrate-lib';
import { cryptoWalletAccountSelect, cryptoWalletDisconnect } from './actions';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { toast } from 'react-toastify';

const connectWalletStyle = {
  border: '1px solid #f2f4f6',
  borderRadius: '12px',
  minWidth: '7vw',
  // boxShadow: "4px 4px 4px rgb(151 167 195 / 44%), -4px -4px 4px #f2f4f660"
};

const ConnectedAccounts = () => {
  const balanceRef = useRef();
  const accountNameRef = useRef();

  const connectedAccounts = useSelector(
    (state) => state.headerReducer.accountsAvailableInWallet
  );
  const defaultAccounts = useSelector(
    (state) => state.headerReducer.defaultAccounts
  );
  const dispatch = useDispatch();
  const [accountName, setAccountName] = useState('Select Account');

  const handleAccountSelect = async (e) => {
    try {
      let currAccountName = e.target.value;
      let currAcc;

      [...connectedAccounts, ...defaultAccounts]?.forEach((acc, index) => {
        if (acc.meta.name === currAccountName) {
          currAcc = acc;
        }
      });

      setAccountName(currAcc.meta.name);
      dispatch(cryptoWalletAccountSelect(currAcc));

      await getAndSetBalanceField(currAcc);
    } catch (error) {
      console.log(error);
      toast.error(`Error: ${error}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  const getAndSetBalanceField = async (currAcc) => {
    try {
      const BLOCKCHAIN_NODE_URL = process.env.REACT_APP_BLOCKCHAIN_NODE;
      const provider = new WsProvider(BLOCKCHAIN_NODE_URL);
      const api = await ApiPromise.create({ provider });

      let {
        data: { free: previousFree },
        nonce: previousNonce,
      } = await api.query.system.account(currAcc.address);
      balanceRef.current.value = previousFree.toHuman();

      console.log(
        `${currAcc.meta.name} has a balance of ${previousFree}, nonce ${previousNonce}`
      );
    } catch (error) {
      console.log(error);
      toast.error(`Error: ${error}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    const accName = accountNameRef.current.value;
    [...connectedAccounts, ...defaultAccounts]?.forEach((acc, index) => {
      if (acc.meta.name === accName) {
        dispatch(cryptoWalletAccountSelect(acc));
        getAndSetBalanceField(acc);
      }
    });
  }, []);

  return (
    <>
      <Form className="d-flex">
        {console.log('defaultAccounts', defaultAccounts)}
        <FormControl
          as="select"
          size="md"
          aria-label="Default select example"
          className="me-2"
          onClick={(e) => handleAccountSelect(e)}
          onLoadStart={(e) => handleAccountSelect(e)}
          ref={accountNameRef}
        >
          {[...connectedAccounts, ...defaultAccounts]?.map((acc, index) => (
            <option key={index}>{acc.meta.name}</option>
          ))}
        </FormControl>
        <Form.Control
          className="me-2"
          type="text"
          placeholder="Balance"
          name="accountBalance"
          size="md"
          readOnly
          ref={balanceRef}
          disabled
        />
        <Button
          variant="outline-info"
          onClick={() => {
            dispatch(cryptoWalletDisconnect());
          }}
        >
          <span style={{ fontSize: '12px' }}>Switch&nbsp;Wallet</span>
        </Button>
      </Form>
    </>
  );
};

export default ConnectedAccounts;
