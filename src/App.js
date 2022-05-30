import React, { useState, createRef } from "react";
import {
    Container,
    Dimmer,
    Loader,
    Grid,
    Sticky,
    Message,
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import { SubstrateContextProvider, useSubstrateState } from "./substrate-lib";
import { DeveloperConsole } from "./substrate-lib/components";

import Routes from "./Routes";

import AccountSelector from "./AccountSelector";
import Balances from "./Balances";
import BlockNumber from "./BlockNumber";
import Events from "./Events";
import Interactor from "./Interactor";
import Metadata from "./Metadata";
import NodeInfo from "./NodeInfo";
import TemplateModule from "./TemplateModule";
import Transfer from "./Transfer";
import Upgrade from "./Upgrade";
import TestingSubstrateLib from "./TestingSubstrateLib";
import DashBoard from "./View/Modules/DashBoard/DashBoard";
import { useSelector } from "react-redux";
import AppHeader from "./Components/AppHeader/AppHeader";
import AppFooter from "./Components/AppFooter/AppFooter";

function Main() {
    const [accountAddress, setAccountAddress] = useState(null);
    const { apiState, keyring, keyringState, apiError } = useSubstrateState();
    const accountPair =
        accountAddress &&
        keyringState === "READY" &&
        keyring.getPair(accountAddress);

    const loader = (text) => (
        <Dimmer active>
            <Loader size="small">{text}</Loader>
        </Dimmer>
    );

    const message = (err) => (
        <Grid centered columns={2} padded>
            <Grid.Column>
                <Message
                    negative
                    compact
                    floating
                    header="Error Connecting to Substrate"
                    content={`${JSON.stringify(err, null, 4)}`}
                />
            </Grid.Column>
        </Grid>
    );

    if (apiState === "ERROR") return message(apiError);
    else if (apiState !== "READY") return loader("Connecting to Substrate");

    if (keyringState !== "READY") {
        return loader(
            "Loading accounts (please review any extension's authorization)"
        );
    }

    const contextRef = createRef();


    return (
        <div ref={contextRef}>
            <Sticky context={contextRef}>
                <AccountSelector setAccountAddress={setAccountAddress} />
            </Sticky>
            <Container>
                <Grid stackable columns="equal">
                    <Grid.Row stretched>
                        <TestingSubstrateLib />
                    </Grid.Row>
                    <Grid.Row stretched>
                        <DashBoard />
                    </Grid.Row>
                    {/* <Grid.Row stretched>
                        <NodeInfo />
                        <Metadata />
                        <BlockNumber />
                        <BlockNumber finalized />
                    </Grid.Row>
                    <Grid.Row stretched>
                        <Balances />
                    </Grid.Row>
                    <Grid.Row>
                        <Transfer accountPair={accountPair} />
                        <Upgrade accountPair={accountPair} />
                    </Grid.Row>
                    <Grid.Row>
                        <Interactor accountPair={accountPair} />
                        <Events />
                    </Grid.Row>
                    <Grid.Row>
                        <TemplateModule accountPair={accountPair} />
                    </Grid.Row> */}
                </Grid>
            </Container>
            <DeveloperConsole />
        </div>
    );
}

export default function App() {
    const isLoggedIn = useSelector(
        (state) => state.authenticationReducer.isLoggedIn
    );
    return (
        <SubstrateContextProvider>
            {!isLoggedIn ? (
                <Routes />
            ) : (
                <>
                    <AppHeader />
                    <Container
                        className="dashboard-container"
                        style={{ marginTop: "50px", marginBottom: "30px" }}
                    >
                        <Routes />
                    </Container>
                    <AppFooter />
                </>
            )}
        </SubstrateContextProvider>
    );
};
