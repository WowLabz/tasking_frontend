import { Button } from "react-bootstrap";
import { TASK_STATUS } from "../TaskDetails/constants";
import * as constants from "./constants";

export const getAttributesForCard = (status) => {
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
                    <Button
                        key={1}
                        variant="success"
                        name={constants.FORM_TYPES.APPROVE_TASK.type}
                        onClick={(e) => showFormModal(e, data)}
                    >
                        <b>Approve</b>
                    </Button>,
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

        case TASK_STATUS.PendingRatings:
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
                        <b>Bid</b>
                    </Button>
                ),
            };
    }
};
