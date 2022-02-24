import React, { useEffect, useState } from "react";
import { Badge, Button, Card, Col, Row } from "react-bootstrap";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Attachments from "../DashBoard/Attachments";
import { TASK_STATUS } from "./constants";

const TaskDescriptionCard = ({ tab }) => {
    const { tabId, tabType, task } = tab;
    const MAX_PROGRESS_VALUE = 5;
    const [progressValue, setProgressValue] = useState(1);

    const {
        taskId,
        client,
        workerId,
        taskDeadline,
        cost,
        status,
        taskDescription,
        publisherName,
        workerName,
        taskTags,
        attachments,
    } = task;

    const getProgressValue = (status) => {
        let val;
        switch (status) {
            case TASK_STATUS.Open:
                val = 1;
                break;
            case TASK_STATUS.InProgress:
                val = 2;
                break;
            case TASK_STATUS.PendingApproval:
                val = 3;
                break;
            case TASK_STATUS.PendingRatings:
                val = 4;
                break;
            case TASK_STATUS.Completed:
                val = 5;
                break;
            default:
                val = 1;
                break;
        }
        setProgressValue(val);
    };

    useEffect(() => {
        getProgressValue(status);
        return () => {};
    }, []);

    const computeEscrow = (cost) => {
        let val = cost.split(" ");
        let num = parseInt(val[0]);
        return `${num * 2} ${val[1]}`;
    };

    return (
        <Card.Body>
            <Row>
                <Col md={8} xs={8} sm={8} lg={8}>
                    <div
                        className="d-flex flex-column justify-content-start align-items-start"
                        style={{ gap: "10px" }}
                    >
                        <ul>
                            <li>Task Description: {taskDescription}</li>
                            <li>
                                Publisher Name: <span>{publisherName}</span>
                            </li>
                            {status !== TASK_STATUS.Open && (
                                <li>
                                    Worker Name: <span>{workerName}</span>
                                </li>
                            )}
                            <li>Task Deadline: {taskDeadline} days</li>
                            <li>Task Cost: {cost}</li>
                        </ul>
                        <div>
                            {taskTags.map((tag, idx) => (
                                <Badge
                                    variant={`secondary`}
                                    className={`px-2 m-1`}
                                    style={{
                                        color: `${"white"}`,
                                        backgroundColor: `${"#272b41"}`,
                                        borderRadius: "10px",
                                        padding: "0.4rem",
                                        fontSize: "10px",
                                    }}
                                    key={idx}
                                >
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        {attachments.length !== 0 && (
                            <Attachments attachments={attachments} />
                        )}
                        <Badge
                            pill
                            style={{
                                color: "black",
                                background: "#ff0000",
                                fontSize: "14px",
                            }}
                        >
                            Outstanding Escrow:{" "}
                            {status === TASK_STATUS.Completed
                                ? "0"
                                : status === TASK_STATUS.PendingApproval ||
                                  status === TASK_STATUS.PendingRatings
                                ? computeEscrow(cost)
                                : cost}
                        </Badge>
                        {status === TASK_STATUS.Completed && (
                            <Badge
                                pill
                                style={{
                                    color: "white",
                                    background: "#198754",
                                    fontSize: "14px",
                                }}
                            >
                                Amount Transferred To Worker: {cost}
                            </Badge>
                        )}
                    </div>
                </Col>
                <Col md={4} xs={4} sm={4} lg={4}>
                    <div className="d-flex justify-content-center align-items-center m-1">
                        <Badge
                            pill
                            style={{
                                color: "white",
                                background: "#198754",
                                fontSize: "12px",
                                textAlign: "center",
                            }}
                        >
                            Task Completion
                        </Badge>
                    </div>
                    <div
                        style={{
                            width: 150,
                            height: 150,
                            display: "table",
                            margin: "auto",
                        }}
                        className="p-1"
                    >
                        <CircularProgressbar
                            value={progressValue}
                            text={`${
                                (progressValue / MAX_PROGRESS_VALUE) * 100
                            }%`}
                            maxValue={MAX_PROGRESS_VALUE}
                            strokeWidth={8}
                            styles={buildStyles({
                                textSize: "14px",
                                textColor: "#000",
                                pathColor: "#272b41",
                            })}
                        />
                    </div>
                </Col>
            </Row>
        </Card.Body>
    );
};

export default TaskDescriptionCard;
