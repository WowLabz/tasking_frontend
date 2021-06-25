import React, { useEffect, useState } from "react";
import { useSubstrate } from "./substrate-lib";
import { useDispatch, useSelector } from "react-redux";

import * as ActionCreators from "./View/Modules/DashBoard/actionCreators";
import * as palletTaskingFunctions from "./palletTaskingFunctions";

/**
 * Testing Completed: {PASS}
 * @returns
 */
const PalletTaskingTesting = () => {
    const { api, keyring } = useSubstrate();

    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.dashBoardReducer.tasks);
    const [state, setState] = useState({
        count: "",
        tasks: [],
        taskCount: "",
        keyRingAccounts: "",
    });

    /**
     * Testing get count from backend
     * @returns count
     */
    const countFromBackEnd = async () => {
        const count = await palletTaskingFunctions.getCountFromStorage(api);
        console.log(`count from backend: ${count}`);
        // setState({ ...state, count: count });
        // console.log(`Count: ${state.count}`);
        return count;
    };

    /**
     * Testing increase counter function
     * with pallet tasking
     */
    const increaseCounterAtBackEnd = async () => {
        console.log(`alice ${JSON.stringify(state.keyRingAccounts)}`);
        palletTaskingFunctions.increaseCounterTx(
            api,
            state.keyRingAccounts.alice
        );
    };

    /**
     * Function to access the pallet tasking storage
     * and get the task count
     * and task details
     * @param {Number} taskId
     */
    const getTaskCountAndTaskDetailsFromBackEnd = async (taskId) => {
        let taskCount = await palletTaskingFunctions.taskCountQuery(api);
        console.log(`taskCount ${taskCount} `);

        let task = await palletTaskingFunctions.taskStorageQuery(api, taskId);
        console.log(`task ${JSON.stringify(task)}`);
    };

    /**
     * Testing get tasks
     * Note: this only prints the task details
     * at the backend blockchain node
     * @param {Number} taskId
     */
    const printTaskDetailsAtBackEnd = async (taskId) => {
        await palletTaskingFunctions.getTaskDetails(
            api,
            taskId,
            state.keyRingAccounts.alice
        );
    };

    /**
     * Testing creating a task
     * with pallet tasking
     */
    const createTaskAtBackEnd = async () => {
        await palletTaskingFunctions.createTaskTx(
            api,
            state.keyRingAccounts.alice,
            10,
            900,
            "creating a test task"
        );
    };

    /**
     * Bid for task
     * using pallet tasking
     * @param {Number} taskId
     */
    const bidForTaskAtBackEnd = async (taskId) => {
        await palletTaskingFunctions.bidForTaskTx(
            api,
            state.keyRingAccounts.bob,
            taskId
        );
    };

    /**
     * Approve for task
     * using pallet tasking
     * @param {Number} taskId
     */
    const approveTaskAtBackEnd = async (taskId) => {
        await palletTaskingFunctions.approveTaskTx(
            api,
            state.keyRingAccounts.alice,
            taskId
        );
    };

    /**
     * complete task
     * using pallet tasking
     * @param {Number} taskId
     */
    const completeTaskAtBackEnd = async (taskId) => {
        await palletTaskingFunctions.taskCompletedTx(
            api,
            state.keyRingAccounts.bob,
            taskId
        );
    };

    /**
     * Test Function to test transfer fn
     * using pallet tasking from Alice to Bob
     */
    const transferUsingCustomPallet = async () => {
        await palletTaskingFunctions.transferUsingPalletTasking(
            api,
            state.keyRingAccounts.alice,
            palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.BOB,
            120000
        );
    };

    /**
     * Test function to test transfer
     * using pallet balances
     */
    const transferUsingPalletBalances = async () => {
        await palletTaskingFunctions.transferTx(
            api,
            state.keyRingAccounts.alice,
            12345
        );
        console.log(`PalletBalances Transfer Result}`);
    };

    /**
     * Test function to get account balance
     * using pallet balances
     * @param {String} accountId
     */
    const getAccountBalanceUsingPalletBalances = async (accountId) => {
        let result = await palletTaskingFunctions.getAccountBalance(
            api,
            accountId
        );
    };

    /**
     * Function to print the chain metadata
     * and runtime version
     */
    const getRuntimeMetaDataAndVersion = async () => {
        palletTaskingFunctions.getRunTimeMetaData(api);
        palletTaskingFunctions.getRunTimeVersion(api);
    };

    /**
     * Function to get all the tasks
     * from the chain storage
     */
    const getAllTasksFromChain = async () => {
        let result = await palletTaskingFunctions.getAllTasks(api);
        if (result) {
            console.log(`All Tasks From Chain: ${result.length}`);
            setState({ ...state, tasks: [...result] });
        }
        console.log(result);
        dispatch(ActionCreators.setTasksFromBackEnd([...result]));
    };

    useEffect(() => {
        const init = async () => {
            try {
                const { alice, bob } =
                    palletTaskingFunctions.getAccountsFromKeyRing();
                setState({
                    ...state,
                    keyRingAccounts: { alice, bob },
                });

                // Listening to events on the chain
                palletTaskingFunctions.handleOnChainEvents(api);

                // Comment and uncomment the functions below
                // To test the chain integration

                // Functions only to read data

                await getAllTasksFromChain();
                // getTaskCountAndTaskDetailsFromBackEnd(0);
                // printTaskDetailsAtBackEnd(0);
                // countFromBackEnd();
                // getAccountBalanceUsingPalletBalances(
                //     palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.ALICE
                // );
                // getRuntimeMetaDataAndVersion()

                // Functions to modify data
                // and transaction on the chain

                // increaseCounterAtBackEnd();
                // createTaskAtBackEnd();
                // bidForTaskAtBackEnd(3);
                // completeTaskAtBackEnd(3);
                // approveTaskAtBackEnd(3);
                // transferUsingCustomPallet();
                // transferUsingPalletBalances();
            } catch (error) {
                console.log(`Error From Pall`);
            }
        };
        init();
    }, [api?.query.palletTasking]);

    console.log(
        `All Tasks From ComponentState: ${JSON.stringify(state.tasks)}`
    );
    return <div>PalletTaskingTesting</div>;
};

export default PalletTaskingTesting;
