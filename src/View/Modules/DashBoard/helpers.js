import { Button } from "react-bootstrap";
import { TASK_STATUS } from "../TaskDetails/constants";
import * as constants from "./constants";

export const getAttributesForCard = (status, data, showFormModal) => {
    switch (status) {
        case TASK_STATUS.Completed:
            return {
                badgeColor: "green",
                button: (
                    <Button
                        variant="secondary"
                        name={`Task Successfully Completed`}
                    >
                        <b>Task Successfully Completed</b>
                    </Button>
                ),
            };
        case TASK_STATUS.InProgress:
            return {
                badgeColor: "yellow",
                button: [
                    <Button
                        key={0}
                        variant="primary"
                        name={constants.FORM_TYPES.COMPLETE_TASK.type}
                        onClick={(e) => showFormModal(e, data)}
                    >
                        <b>Complete</b>
                    </Button>,
                    // <Button
                    //     key={1}
                    //     variant="success"
                    //     name={constants.FORM_TYPES.APPROVE_TASK.type}
                    //     onClick={(e) => showFormModal(e, data)}
                    // >
                    //     <b>Approve</b>
                    // </Button>,
                ],
            };

        case TASK_STATUS.PendingApproval:
            return {
                badgeColor: "red",
                button: (
                    <Button
                        variant="success"
                        name={constants.FORM_TYPES.APPROVE_TASK.type}
                        onClick={(e) => showFormModal(e, data)}
                    >
                        <b>Approve</b>
                    </Button>
                ),
            };

        case TASK_STATUS.CustomerRatingPending:
            return {
                badgeColor: "red",
                button: (
                    <Button
                        variant="success"
                        name={
                            constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type
                        }
                        onClick={(e) => showFormModal(e, data)}
                    >
                        <b>Provide Customer Ratings</b>
                    </Button>
                ),
            };
        case TASK_STATUS.CustomerRatingProvided:
            return {
                badgeColor: "red",
                button: (
                    <Button
                        variant="success"
                        name={
                            constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type
                        }
                        onClick={(e) => showFormModal(e, data)}
                    >
                        <b>Close</b>
                    </Button>
                ),
            };
        case TASK_STATUS.DisputeRaised:
            return {
                badgeColor: "red",
                button: (
                    <Button
                        variant="success"
                        name={
                            constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type
                        }
                        onClick={(e) => showFormModal(e, data)}
                    >
                        <b>DisputeRaised</b>
                    </Button>
                ),
            };
        case TASK_STATUS.VodingPeriod:
            return {
                badgeColor: "red",
                button: (
                    <Button
                        variant="success"
                        name={
                            constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type
                        }
                        onClick={(e) => showFormModal(e, data)}
                    >
                        <b>VotingPeriod</b>
                    </Button>
                ),
            };
        case TASK_STATUS.JuryDecisionReached:
            return {
                badgeColor: "red",
                button: (
                    <Button
                        variant="success"
                        name={
                            constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type
                        }
                        onClick={(e) => showFormModal(e, data)}
                    >
                        <b>JuryDecisionReached</b>
                    </Button>
                ),
            };
        case TASK_STATUS.Open:
            return {
                badgeColor: "blue",
                button: (
                    <Button
                        variant="warning"
                        name={constants.FORM_TYPES.BID_FOR_TASK.type}
                        onClick={(e) => showFormModal(e, data)}
                    >
                        <b>Bid</b>
                    </Button>
                ),
            };
        default:
            return {
                badgeColor: "blue",
                button: (
                    <Button
                        variant="warning"
                        name={constants.FORM_TYPES.BID_FOR_TASK.type}
                        onClick={(e) => showFormModal(e, data)}
                    >
                        <b>Default</b>
                    </Button>
                ),
            };
    }
};

export const sortTasksByUserTags = (currentUserTags, tasksArr) => {
    tasksArr.sort((a, b) => {
        if (currentUserTags.every((tag) => a.taskTags.includes(tag))) {
            return 1;
        } else if (currentUserTags.some((tag) => a.taskTags.includes(tag))) {
            return -1;
        } else {
            return 0;
        }
    });
    return tasksArr;
};
