import React, { useEffect, useState } from "react";
import { useSubstrate } from "./substrate-lib";

import { ApiPromise, WsProvider } from "@polkadot/api";
import { Keyring } from "@polkadot/keyring";

const TestingSubstrateLib = () => {
    const { api } = useSubstrate();

    const [testVariable, setTestVariable] = useState("");

    const ALICE = "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY";
    const BOB = "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty";

    const connectToParachain = async () => {

        if (api === null) {
            return;
        }

        const keyring = new Keyring({ type: "sr25519" });
        const alice = keyring.addFromUri("//Alice");

        let beforeCount = await api.query.palletTasking.count();

        let increaseCounter = api.tx.palletTasking
            .increaseCounter()
            .signAndSend(alice);

        let afterCount = await api.query.palletTasking.count();

        // let createTaskTx = api.tx.palletTasking
        //     .createTask(30, "create a test task", 700)
        //     .signAndSend(alice);

        const bob = keyring.addFromUri("//Bob");
        let bidForTask = api.tx.palletTasking.bidForTask(2);
        let txBidForTask = await bidForTask.signAndSend(bob);

        let task = await api.query.palletTasking.taskStorage(2);
        setTestVariable(task.toHuman());

        let taskCount = await api.query.palletTasking.taskCount();

        // let allTasks = await api.query.palletTasking.taskStorage.entries;
    };

    const traditionalConnectionToParachain = async () => {
        const api = await ApiPromise.create({
            provider: WsProvider,
            types: {
                Balance: "u64",
                TaskDetails: {
                    task_id: "u128",
                    client: "AccountId",
                    worker_id: "Option<AccountId>",
                    task_deadline: "u64",
                    task_description: "Vec<u8>",
                    cost: "Balance",
                    is_bidded: "bool",
                    is_completed: "bool",
                },
            },
        });

        let {
            data: { free: previousFree },
            nonce: previousNonce,
        } = await api.query.system.account(ALICE);


        const keyring = new Keyring({ type: "sr25519" });
        const alice = keyring.addFromUri("//Alice");
        const bob = keyring.addFromUri("//Bob");

        const transfer = api.tx.balances.transfer(BOB, 12345);
        const hash = await transfer.signAndSend(alice);

        // Here we subscribe to any balance changes and update the on-screen value
        api.query.system.account(
            ALICE,
            ({ data: { free: currentFree }, nonce: currentNonce }) => {
                // Calculate the delta
                const change = previousFree.sub(currentFree);

                // Only display positive value changes (Since we are pulling `previous` above already,
                // the initial balance change will also be zero)
                if (!change.isZero()) {
                    previousFree = currentFree;
                    previousNonce = currentNonce;
                }
            }
        );

        let taskCountNew = await api.query.palletTasking.taskCount();

        // let createTaskTx = api.tx.palletTasking
        //     .createTask(120, "machine learning", 2100)
        //     .signAndSend(alice);

        let bidForTask = api.tx.palletTasking.bidForTask(0);
        let txBidForTask = await bidForTask.signAndSend(bob);

        let task = await api.query.palletTasking.taskStorage(0);
        setTestVariable(task.toHuman());

        let newTask = await api.query.palletTasking.taskStorage(1);

        let increaseCounter = api.tx.palletTasking
            .increaseCounter()
            .signAndSend(alice);
        let taskCount = await api.query.palletTasking.taskCount();

        // function_for_tasks_and_accounts_using_vec_staking
        let addVecData = api.tx.palletTasking
            .functionForTasksAndAccountsUsingVecStaking(0)
            .signAndSend(bob);
        let getVecData = await api.query.palletTasking.stakerStorage(0);
    };

    useEffect(() => {
        connectToParachain();
        // traditionalConnectionToParachain();
    }, [api?.query.palletTasking]);

    return (
        <>
            <div>Hello Parachain!</div>
            <pre>Test Variable: {JSON.stringify(testVariable, null, 2)}</pre>
        </>
    );
};

export default TestingSubstrateLib;
