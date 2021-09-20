import React, { useEffect, useState } from "react";
import { Badge, Card, Button, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import * as constants from "./constants";
import { useDispatch, useSelector } from "react-redux";
import { TASK_STATUS } from "../TaskDetails/constants";

const TaskCard = ({ data, showFormModal }) => {
    const history = useHistory();
    const [attributesForCard, setAttributesForCard] = useState({});
    const {
        task_id,
        client,
        worker_id,
        task_deadline,
        cost,
        status,
        task_description,
    } = data;

    const publisher =
        client === constants.DEFAULT_ACCOUNT_IDS.ALICE ? "Alice" : "Bob";

    const getAttributesForCard = (status) => {
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
                                constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS
                                    .type
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

    const init = () => {
        setAttributesForCard(getAttributesForCard(status));
    };

    useEffect(() => {
        init();
        return () => {};
    }, [data]);

    return (
        <Col
            xs={12}
            sm={12}
            md={4}
            lg={4}
            className="d-flex justify-content-center align-items-center"
        >
            <Card className="task-card  p-4">
                <Card.Body
                    onClick={() =>
                        history.push({
                            pathname: `/taskdetails/${task_id}`,
                        })
                    }
                >
                    <Card.Text className="d-flex justify-content-between align-items-center">
                        <b>{_.capitalize(task_description)}</b>
                        <Badge
                            variant={attributesForCard.badgeColor}
                            className={`px-2 mx-2`}
                            style={{
                                display: "table",
                                color: `${
                                    attributesForCard.badgeColor === "yellow"
                                        ? "black"
                                        : "white"
                                }`,
                                backgroundColor: `${attributesForCard.badgeColor}`,
                                borderRadius: "10px",
                                padding: "0.4rem",
                            }}
                        >
                            {status}
                        </Badge>
                    </Card.Text>
                    <hr />
                    <Card.Text>
                        <b>Publisher:</b> {publisher}
                    </Card.Text>
                    <Card.Text>
                        <b>TaskId:</b> {task_id}
                    </Card.Text>
                    <Card.Text>
                        <b>TaskDeadline: </b>
                        {task_deadline} days
                    </Card.Text>
                    <Card.Text>
                        <b>TaskCost:</b> {cost}
                    </Card.Text>
                    <Card.Text className="d-flex justify-content-between align-items-center">
                        <div>
                            <div>
                                <b>Start Date</b>
                            </div>
                            <small>{"31/5/2021"}</small>
                        </div>
                        <div>
                            <div>
                                <b>End Date</b>
                            </div>
                            <small>{"24/6/2021"}</small>
                        </div>
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="card-footer justify-content-center">
                    {attributesForCard.button}
                </Card.Footer>
            </Card>
        </Col>
    );
};

export default TaskCard;
