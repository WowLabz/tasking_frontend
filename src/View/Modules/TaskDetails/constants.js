import TaskDetails from "./TaskDetails";

export const TAB_TYPE = {
  TASK_DETAILS: "Task Details",
  CREATE_TASK: "Create Task",
  BID_TASK: "Bid For Task",
  COMPLETE_TASK: "Complete Task",
  APPROVE_TASK: "Approve Task",
  RATINGS_FOR_TASK: "Ratings for Task",
  COURT_SUMMARY: "Court Summary",
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
  VotingPeriod: "VotingPeriod",
  JuryDecisionReached: "JuryDecisionReached",
  Completed: "Completed",
};
