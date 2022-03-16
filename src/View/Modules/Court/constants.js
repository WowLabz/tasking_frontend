import TaskDetails from "./Court";

export const COURT_TAB_TYPE = {
    COURT_DETAILS: "Court Details",
    POTENTIAL_JURORS: "Potential Jurors",
    FINAL_JURORS: "Final Jurors",
    COMPLETE_TASK: "Complete Task",
    APPROVE_TASK: "Approve Task",
    RATINGS_FOR_TASK: "Ratings for Task",
};

export const TabDetails = {
    tabId: Number,
    tabType: String,
    description: String,
    escrow: String,
    status: String,
    accountId: String,
};

export const TASK_STATUS = {
    Open: "Open",
    InProgress: "InProgress",
    PendingApproval: "PendingApproval",
    CustomerRatingPending: "CustomerRatingPending",
    CustomerRatingProvided: "CustomerRatingProvided",
    DisputeRaised: "DisputeRaised",
    VodingPeriod: "VotingPeriod",
    JuryDecisionReached: "JuryDecisionReached",
    Completed: "Completed",
};

export const DEFAULT_SUBSTRATE_ACCOUNTS_IDS = {
    ALICE: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    ALICE_STASH: "5GNJqTPyNqANBkUVMN1LPPrxXnFouWXoe2wNSmmEoLctxiZY",
    BOB: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
    BOB_STASH: "5HpG9w8EBLe5XCrbczpwq5TSXvedjrBGCwqxK1iQ7qUsSWFc",
    CHARLIE: "5FLSigC9HGRKVhB9FiEo4Y3koPsNmBmLJbpXg2mp1hXcS59Y",
    DAVE: "5DAAnrj7VHTznn2AWBemMuyBwZWs6FNFjdyVXUeYum3PTXFy",
    EVE: "5HGjWAeFDfFCWPsjFQdVV2Msvz2XtMktvgocEZcCj68kUMaw",
    FERDIE: "5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL",
}
