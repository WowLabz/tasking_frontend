import {
    CRYPTO_WALLET_ACCOUNT_SELECT,
    CRYPTO_WALLET_CONNECTION,
    CRYPTO_WALLET_DISCONNECT,
    CRYPTO_WALLET_ERROR,
    DEFAULT_POLKA_ACCOUNTS,
    TEST_WALLET_CONNECTION,
} from "./constants";

const initialState = {
    isWalletConnected: false,
    currentWalletDetails: null,
    accountsAvailableInWallet: [],
    defaultAccounts: [...DEFAULT_POLKA_ACCOUNTS],
    walletError: null,
};

export const headerReducer = (state = initialState, action) => {
    switch (action.type) {
        case TEST_WALLET_CONNECTION:
            return {
                ...state,
                isWalletConnected: true,
                currentWalletDetails: null,
            }
        case CRYPTO_WALLET_CONNECTION:
            return {
                ...state,
                isWalletConnected: true,
                currentWalletDetails: null,
                accountsAvailableInWallet: action.payload,
            };
        case CRYPTO_WALLET_ACCOUNT_SELECT:
            return {
                ...state,
                currentWalletDetails: action.payload,
            };
        case CRYPTO_WALLET_ERROR:
            return {
                ...state,
                isWalletConnected: false,
                currentWalletDetails: null,
                accountsAvailableInWallet: [],
                walletError: action.payload,
            };
        case CRYPTO_WALLET_DISCONNECT:
            return {
                ...state,
                isWalletConnected: false,
                currentWalletDetails: null,
                accountsAvailableInWallet: [],
            };
        default:
            return state;
    }
};
