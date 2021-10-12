import { CRYPTO_WALLET_CONNECTION, CRYPTO_WALLET_DISCONNECT, CRYPTO_WALLET_ERROR } from "./constants"

const initialState = {
    isWalletConnected: false,
    currentWalletDetails: null,
    walletError: null
}

export const headerReducer = (state = initialState, action) => {
    switch (action.type) {
        case CRYPTO_WALLET_CONNECTION:
            return {
                ...state,
                isWalletConnected: true,
                currentWalletDetails: action.payload
            }
        case CRYPTO_WALLET_ERROR:
            return {
                ...state,
                isWalletConnected: false,
                walletError: action.payload
            }
        case CRYPTO_WALLET_DISCONNECT:
            return {
                ...state,
                isWalletConnected: false,
                currentWalletDetails: null
            }
        default:
            return state
    }
}

