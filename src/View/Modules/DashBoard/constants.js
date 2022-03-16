export const GET_TASKS = "GET_TASKS";
export const ATTRIBUTES_FOR_TASK_CARD = "ATTRIBUTES_FOR_TASK_CARD";

export const FORM_TYPES = {
    CREATE_TASK: { type: "Create New Task", title: "Create Task" },
    BID_FOR_TASK: { type: "Bid", title: "Bid Task" },
    COMPLETE_TASK: { type: "Complete", title: "Complete Task" },
    APPROVE_TASK: { type: "Approve", title: "Approve Task" },
    PROVIDE_CUSTOMER_RATINGS: {
        type: "Provide Customer Ratings",
        title: "Customer Ratings",
    },
    CLOSE_TASK: { type: "Close", title: "Close Task" },
    RAISE_DISPUTE: { type: "Raise Dispute", title: "Raise Dispute" },
    DISAPPROVE_TASK: { type: "Disapprove", title: "Disapprove Task" },
};

export const DEFAULT_ACCOUNT_IDS = {
    ALICE: "5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY",
    BOB: "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
};
export const SORTING_OPTIONS = "SORTING_OPTIONS";

export const SORT_BY = {
    userTags: "UserTags",
    statusOpen: "Open",
    statusInProgress: "InProgress",
    statusPendingApproval: "PendingApproval",
    statusPendingRatings: "PendingRatings",
    statusCompleted: "Completed",
    recent: "Recent",
};

export const USER_TYPE = {
    CUSTOMER: "Customer",
    WORKER: "Worker",
};
