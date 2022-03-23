import { ApiPromise, wsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
toast.configure();

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

export const TYPES = {
  Balance: 'u64',
  TaskDetails: {
    task_id: 'u128',
    client: 'AccountId',
    worker_id: 'Option<AccountId>',
    task_deadline: 'u64',
    task_description: 'Text',
    cost: 'Balance',
    is_bidded: 'bool',
    is_completed: 'bool',
  },
};

/**
 * Connect to the connectToParaChainUsingDotApi
 * from the @polkadot/api
 * @param {JSON} types
 * @returns api
 */
export const connectToParaChainUsingDotApi = async (types) => {
  const api = await ApiPromise.create({
    types,
  });
  return api;
};

/**
 * Get the AccountId's from the keyring
 * for default accounts Alice and Bob
 * @returns alice and bob keyring accountId's
 */
export const getAccountsFromKeyRing = () => {
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');
  const bob = keyring.addFromUri('//Bob');
  const charlie = keyring.addFromUri('//Charlie');
  const dave = keyring.addFromUri('//Dave');
  const eve = keyring.addFromUri('//Eve');
  const ferdie = keyring.addFromUri('//Ferdie');
  const aliceStash = keyring.addFromUri('//Alice//stash');
  const bobStash = keyring.addFromUri('//Bob-Stash');

  return { alice, bob, charlie, dave, eve, ferdie, aliceStash, bobStash };
};

/**
 * To Handle Events while making transactions on chain
 * @param {events} param
 */
export const transactionEventHandler = (events, status) => {
  console.log('Transaction status:', status.type);
  // toast.info(`Transaction status: ${status.type}`, {
  //     position: toast.POSITION.TOP_RIGHT,
  //     autoClose: 5000,
  // });
  const toastArr = [];

  if (status.isInBlock) {
    console.log('Included at block hash', status.asInBlock.toHex());
    console.log('Events:');
    // toast.info(`Included at block hash ${status.asInBlock.toHex()}`, {
    //     position: toast.POSITION.TOP_RIGHT,
    //     autoClose: 3000,
    // });

    events.forEach(({ event: { data, method, section }, phase }) => {
      if (method === 'ExtrinsicFailed') {
        toast.error(`Error: \t\t${data.toString()}`, {
          autoClose: 5000,
          position: 'bottom-right',
        });
      } else if (method === 'ExtrinsicSuccess') {
        console.log(`data: ${data}`);
        console.log(`method: ${method}`);
        console.log(`section: ${section}`);
      } else {
        // toast.success(`Success: \t\t${section}:${method}: ${data.toString()}`, {
        //   autoClose: 5000,
        // });
      }

      console.log(
        '\t',
        phase.toString(),
        `: ${section}.${method}`,
        data.toString()
      );
      toastArr.push(`\n${section}.${method}`);
    });
  } else if (status.isFinalized) {
    console.log('Finalized block hash', status.asFinalized.toHex());
    // toast.success(`Finalized block hash ${status.asFinalized.toHex()}`, {
    //     position: toast.POSITION.TOP_RIGHT,
    //     autoClose: 5000,
    // });
  }
  return toastArr;
};

/**
 * To handle errors in transactions on chain
 * @param {error} err
 */
export const transactionErrorHandler = (err) => {
  console.log(`Transaction Error: ${err}`);
  toast.error(`Transaction Error: ${err}`, {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 5000,
  });
};

// Sample functions for using pallet balances

/**
 * Transfer function using the pallet balances
 * Transfers money from Alice to Bob
 * @param {Number} amount
 */
export const transferTx = async (api, accountIdFromKeyRing, amount) => {
  try {
    if (api === null) return;
    const transfer = api.tx.balances.transfer(DEFAULT_ACCOUNT_IDS.BOB, amount);
    const hash = await transfer.signAndSend(
      accountIdFromKeyRing,
      transactionEventHandler
    );
  } catch (error) {
    transactionErrorHandler(error);
  }
};

/**
 * Get account Balance and nounce
 * @param {*} api
 * @param {String} accountId
 * @returns
 */
export const getAccountBalance = async (api, accountId) => {
  if (api === null) return;
  // Samplet AccountId
  // const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
  let {
    data: { free: previousFree },
    nonce: previousNonce,
  } = await api.query.system.account(accountId);
  console.log(`Account Balance: ${previousFree}, Nonce: ${previousNonce}`);
  let balanceInfo = await api.query.system.account(accountId);
  return balanceInfo;
};

// Calling Dispatchables from the pallet tasking

/**
 * createTask function from the palletTasking
 * @param {*} api
 * @param {AccountId} accountIdFromKeyRing
 * @param {Number} taskDuration
 * @param {Number} taskCost
 * @param {String} taskTitle
 */
export const createTaskTx = async (
  api,
  accountId,
  taskDuration,
  taskCost,
  taskTitle,
  publisherName,
  taskTags,
  publisherAttachments
) => {
  try {
    if (api === null) return;
    let transaction = await api.tx['palletTasking']['createTask'](
      taskDuration,
      taskCost,
      taskTitle,
      publisherName,
      taskTags,
      publisherAttachments
    );

    await handleSignedTransactions(transaction, accountId);
  } catch (error) {
    transactionErrorHandler(error);
  }
};

/**
 * bidForTask function from palletTasking
 * @param {} api
 * @param {AccountId} accountIdFromKeyRing
 * @param {Number} taskId
 */
export const bidForTaskTx = async (api, accountId, taskId, workerName) => {
  try {
    if (api === null) return;
    let transaction = api.tx['palletTasking']['bidForTask'](taskId, workerName);
    await handleSignedTransactions(transaction, accountId);
  } catch (error) {
    transactionErrorHandler(error);
  }
};

/**
 * aprrove function from palletTasking
 * @param {*} api
 * @param {AccountId} accountIdFromKeyRing
 * @param {Number} taskId
 * @param {Number} ratingsForWorker
 */
export const approveTaskTx = async (
  api,
  accountId,
  taskId,
  ratingsForWorker
) => {
  try {
    if (api === null) return;
    let transaction = api.tx.palletTasking.approveTask(
      taskId,
      ratingsForWorker
    );
    await handleSignedTransactions(transaction, accountId);
  } catch (error) {
    transactionErrorHandler(error);
  }
};

/**
 * taskCompleted function from palletTasking
 * @param {*} api
 * @param {AccountId} accountIdFromKeyRing
 * @param {Number} taskId
 */
export const taskCompletedTx = async (
  api,
  accountId,
  taskId,
  workerAttachments
) => {
  try {
    if (api === null) return;
    let transaction = api.tx.palletTasking.taskCompleted(
      taskId,
      workerAttachments
    );
    await handleSignedTransactions(transaction, accountId);
  } catch (error) {
    transactionErrorHandler(error);
  }
};

/**
 * provideCustomerRatings function from palletTasking
 * @param {*} api
 * @param {AccountId} accountIdFromKeyRing
 * @param {Number} taskId
 * @param {Number} ratingsForCustomer
 */
export const provideCustomerRatingsTx = async (
  api,
  accountId,
  taskId,
  ratingsForCustomer
) => {
  try {
    if (api === null) return;
    let transaction = api.tx.palletTasking.provideCustomerRating(
      taskId,
      ratingsForCustomer
    );
    await handleSignedTransactions(transaction, accountId);
  } catch (error) {
    transactionErrorHandler(error);
  }
};

export const closeTaskTx = async (api, accountId, taskId) => {
  try {
    if (api === null) return;
    let transaction = api.tx.palletTasking.closeTask(taskId);
    await handleSignedTransactions(transaction, accountId);
  } catch (error) {
    transactionErrorHandler(error);
  }
};

export const raiseDisputeTx = async (api, accountId, taskId, userType) => {
  try {
    if (api === null) return;
    let transaction = api.tx.palletTasking.raiseDispute(taskId, userType);
    await handleSignedTransactions(transaction, accountId);
  } catch (error) {
    transactionErrorHandler(error);
  }
};

export const disapproveTaskTx = async (api, accountId, taskId) => {
  try {
    if (api === null) return;
    let transaction = api.tx.palletTasking.disapproveTask(taskId);
    await handleSignedTransactions(transaction, accountId);
  } catch (error) {
    transactionErrorHandler(error);
  }
};

// Accessing chain storage

/**
 * TaskCount Storage value
 * from pallet tasking
 * @returns taskCount
 */
export const taskCountQuery = async (api) => {
  if (api === null) return;
  let taskCount = await api.query.palletTasking.taskCount();
  return taskCount;
};

/**
 * TaskStorage Storage value
 * from pallet tasking
 * @param {Number} taskId
 * @returns
 */
export const taskStorageQuery = async (api, taskId) => {
  if (api === null) return;
  let task = await api.query.palletTasking.taskStorage(taskId);
  return task.toHuman();
};

/**
 * Function to get all the tasks
 * from the chain storage
 * @param {*} api
 * @returns allTasks Array
 */
export const getAllTasks = async (api) => {
  if (api === null) return;
  let taskCountFromBackEnd = await taskCountQuery(api);

  console.log(`Getting All Tasks, TaskCount at Chain: ${taskCountFromBackEnd}`);

  let taskArr = [];
  let index;

  for (index = 0; index < taskCountFromBackEnd; index++) {
    let singleTask = await taskStorageQuery(api, index);
    taskArr.push(singleTask);
  }

  console.log(`Getting All Tasks, Total Tasks from Chain: ${taskArr.length}`);
  return taskArr;
};

// Testing counter functions in pallet tasking

/**
 * increaseCounter function from pallet tasking
 * @param {*} api
 * @param {Number} accountIdFromKeyRing
 */
export const increaseCounterTx = async (api, accountIdFromKeyRing) => {
  try {
    if (api === null) return;
    // api.tx[palletRpc][callable](...transformed)
    // api.tx[palletRpc][callable]()
    let transaction = api.tx['palletTasking']['increaseCounter']();
    await transaction.signAndSend(
      accountIdFromKeyRing,
      transactionEventHandler
    );
  } catch (error) {
    transactionErrorHandler(error);
  }
};

/**
 * Count storage value
 * from pallet tasking
 * @param {*} api
 * @returns count
 */
export const getCountFromStorage = async (api) => {
  if (api === null) return;
  let count = await api.query.palletTasking.count();
  return count;
};

// Testing get tasks
// Note: this only prints the task details
// at the backend blockchain node

/**
 * To get the task details from pallet tasking
 * @param {*} api
 * @param {Number} taskId
 * @param {Number} accountIdFromKeyRing
 * @returns
 */
export const getTaskDetails = async (api, taskId, accountId) => {
  try {
    if (api === null) return;
    let transaction = api.tx.palletTasking.getDataFromStore(taskId);
    await handleSignedTransactions(transaction, accountId);
  } catch (error) {
    transactionErrorHandler(error);
  }
};

/**
 * Testing transfer function from pallet tasking
 * @param {*} api
 * @param {Number} fromAccountIdFromKeyRing
 * @param {Number} toAccountId
 * @param {Number} transferAmount
 * @returns
 */
export const transferUsingPalletBalances = async (
  api,
  fromAccountIdFromKeyRing,
  toAccountId,
  transferAmount
) => {
  try {
    if (api === null) return;
    let transaction = api.tx.balances.transfer(toAccountId, transferAmount);
    await handleSignedTransactions(transaction, DEFAULT_ACCOUNT_IDS.ALICE);
  } catch (error) {
    transactionErrorHandler(error);
  }
};

// Handle on chain events

/**
 * Listening to events on the chain
 * @param {*} api
 */
export const handleOnChainEvents = async (api, toast) => {
  if (api === null) return;
  api.query.system.events((events) => {
    console.log(`\nReceived ${events.length} events:`);

    // Loop through the Vec<EventRecord>
    events.forEach((record) => {
      // Extract the phase, event and the event types
      const { event, phase } = record;
      const types = event.typeDef;

      // Show what we are busy with
      console.log(
        `EventName \t\t${event.section}:${
          event.method
        }:: (phase=${phase.toString()})`
      );
      // toast.success(
      //     `\t\t${event.section}:${
      //         event.method
      //     }:: (phase=${phase.toString()})`,
      //     {
      //         position: toast.POSITION.TOP_RIGHT,
      //         autoClose: 9000,
      //     }
      // );
      console.log(`MetaData \t\t${event.meta.documentation.toString()}`);

      // Loop through each of the parameters, displaying the type and data
      event.data.forEach((data, index) => {
        console.log(`Data \t\t\t${types[index].type}: ${data.toString()}`);
      });
    });
  });
};

/**
 * Print the chain metadata
 * @param {*} api
 */
export const getRunTimeMetaData = (api) => {
  if (api === null) return;
  let result = api.runtimeMetadata;
  console.log(`MetaData Using Api: ${result}`);
};

/**
 * Print the chain runtime version
 * @param {*} api
 */
export const getRunTimeVersion = (api) => {
  if (api === null) return;
  let result = api.runtimeVersion;
  console.log(`RuntimeVersion: ${result}`);
};

const handleSignedTransactions = async (transaction, accountId) => {
  try {
    const keyring = new Keyring({ type: 'sr25519' });
    let signedAccount;
    let signer;
    if (accountId === DEFAULT_ACCOUNT_IDS.ALICE) {
      console.log('---1---');
      signedAccount = keyring.addFromUri('//Alice');
      signer = signedAccount.sign;
    } else if (accountId === DEFAULT_ACCOUNT_IDS.BOB) {
      console.log('---2---');
      signedAccount = keyring.addFromUri('//Bob');
      signer = signedAccount.sign;
    } else if (accountId === DEFAULT_ACCOUNT_IDS.CHARLIE) {
      console.log('---2---');
      signedAccount = keyring.addFromUri('//Charlie');
      signer = signedAccount.sign;
    } else if (accountId === DEFAULT_ACCOUNT_IDS.DAVE) {
      console.log('---2---');
      signedAccount = keyring.addFromUri('//Dave');
      signer = signedAccount.sign;
    } else if (accountId === DEFAULT_ACCOUNT_IDS.EVE) {
      console.log('---2---');
      signedAccount = keyring.addFromUri('//Eve');
      signer = signedAccount.sign;
    } else if (accountId === DEFAULT_ACCOUNT_IDS.FERDIE) {
      console.log('---2---');
      signedAccount = keyring.addFromUri('//Ferdie');
      signer = signedAccount.sign;
    } else if (accountId === DEFAULT_ACCOUNT_IDS.ALICE_STASH) {
      console.log('---2---');
      signedAccount = keyring.addFromUri('//Alice//stash');
      signer = signedAccount.sign;
    } else if (accountId === DEFAULT_ACCOUNT_IDS.BOB_STASH) {
      console.log('---2---');
      signedAccount = keyring.addFromUri('//Bob//stash');
      signer = signedAccount.sign;
    } else {
      console.log('---3---');
      signedAccount = accountId;
      const injectedAccount = await web3FromAddress(accountId);
      signer = injectedAccount.signer;
    }
    await transaction.signAndSend(
      signedAccount,
      { signer },
      ({ events = [], status }) => {
        let toastArr = transactionEventHandler(events, status);
        if (toastArr?.length !== 0) {
          toast.success(`${toastArr}`, {
            autoClose: 5000,
            position: 'top-right',
          });
        }
      }
    );
  } catch (error) {
    console.log(error);
    transactionErrorHandler(error);
  }
};
