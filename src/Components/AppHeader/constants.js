export const CRYPTO_WALLET_CONNECTION = 'CRYPTO_WALLET_CONNECTION';
export const CRYPTO_WALLET_ERROR = 'CRYPTO_WALLET_ERROR';
export const CRYPTO_WALLET_DISCONNECT = 'CRYPTO_WALLET_DISCONNECT';
export const CRYPTO_WALLET_ACCOUNT_SELECT = 'CRYPTO_WALLET_ACCOUNT_SELECT';
export const TEST_WALLET_CONNECTION = 'TEST_WALLET_CONNECTION';

export const DEFAULT_ACCOUNT_IDS = {
  ALICE: '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY',
  BOB: '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
  ALICE_STASH: '5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY',
  BOB_STASH: '5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc',
  CHARLIE: '5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y',
  DAVE: '5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy',
  EVE: '5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw',
  FERDIE: '5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL',
};

export const DEFAULT_POLKA_ACCOUNTS = [
  {
    address: DEFAULT_ACCOUNT_IDS.ALICE,
    meta: {
      genesisHash: '',
      name: 'Alice',
      source: 'polkadot-js',
    },
  },
  {
    address: DEFAULT_ACCOUNT_IDS.BOB,
    meta: {
      genesisHash: '',
      name: 'Bob',
      source: 'polkadot-js',
    },
  },
  {
    address: DEFAULT_ACCOUNT_IDS.ALICE_STASH,
    meta: {
      genesisHash: '',
      name: 'Alice-Stash',
      source: 'polkadot-js',
    },
  },
  {
    address: DEFAULT_ACCOUNT_IDS.BOB_STASH,
    meta: {
      genesisHash: '',
      name: 'Bob-Stash',
      source: 'polkadot-js',
    },
  },
  {
    address: DEFAULT_ACCOUNT_IDS.CHARLIE,
    meta: {
      genesisHash: '',
      name: 'Charlie',
      source: 'polkadot-js',
    },
  },
  {
    address: DEFAULT_ACCOUNT_IDS.DAVE,
    meta: {
      genesisHash: '',
      name: 'Dave',
      source: 'polkadot-js',
    },
  },
  {
    address: DEFAULT_ACCOUNT_IDS.EVE,
    meta: {
      genesisHash: '',
      name: 'Eve',
      source: 'polkadot-js',
    },
  },
  {
    address: DEFAULT_ACCOUNT_IDS.FERDIE,
    meta: {
      genesisHash: '',
      name: 'Ferdie',
      source: 'polkadot-js',
    },
  },
];
