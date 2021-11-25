export const CRYPTO_WALLET_CONNECTION = "CRYPTO_WALLET_CONNECTION";
export const CRYPTO_WALLET_ERROR = "CRYPTO_WALLET_ERROR"
export const CRYPTO_WALLET_DISCONNECT = "CRYPTO_WALLET_DISCONNECT"
export const CRYPTO_WALLET_ACCOUNT_SELECT = "CRYPTO_WALLET_ACCOUNT_SELECT";
export const TEST_WALLET_CONNECTION = "TEST_WALLET_CONNECTION";


export const DEFAULT_ACCOUNT_IDS = {
    ALICE: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    BOB: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
};

export const DEFAULT_POLKA_ACCOUNTS = [
    {
        address: DEFAULT_ACCOUNT_IDS.ALICE,
        meta: {
            genesisHash: "",
            name: "Alice",
            source: "polkadot-js",
        },
    },
    {
        address: DEFAULT_ACCOUNT_IDS.BOB,
        meta: {
            genesisHash: "",
            name: "Bob",
            source: "polkadot-js",
        },
    },
]