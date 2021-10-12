import { CRYPTO_WALLET_CONNECTION, CRYPTO_WALLET_DISCONNECT, CRYPTO_WALLET_ERROR } from "./constants"

export const cryptoWalletConnection = (data) => {
    return {
        type: CRYPTO_WALLET_CONNECTION,
        payload: data
    }
}

export const cryptoWalletDisconnect = () => {
    return {
        type: CRYPTO_WALLET_DISCONNECT
    }
}

export const cryptoWalletError = (data) => {
    return {
        type: CRYPTO_WALLET_ERROR,
        payload: data
    }
}