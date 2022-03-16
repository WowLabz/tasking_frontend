import React, { useState, useEffect } from "react";
import { Badge, Card, Col, Image, Row } from "react-bootstrap";
import { DEFAULT_SUBSTRATE_ACCOUNTS_IDS, TASK_STATUS } from "./constants";
import { getAttributesForCard } from "../DashBoard/helpers";
import { TASK_OPEN_LOGO } from "../../../constants/constants";
import { getJuror } from "./helpers";

const FinalJurors = ({ tab }) => {
    const [attributesForCard, setAttributesForCard] = useState({});
    const { tabId, tabType, task } = tab;

    const {
        client,
        cost,
        status,
        taskDeadline,
        taskDescription,
        taskId,
        workerId,
    } = task;

    const init = () => {
        setAttributesForCard(getAttributesForCard(status));
    };

    useEffect(() => {
        init();
        return () => {};
    }, []);


    return (
        <Card.Body>
            <Row>
                <Col md={8} xs={8} sm={8} lg={8}>
                    <div
                        className="d-flex flex-column justify-content-start align-items-start"
                        style={{ gap: "10px" }}
                    >
                        {/* <ul>
                            { task.dispute.finalJurors == 
                            task?.dispute?.finalJuror?.map(
                                (juror, idx) => (
                                    <li key={idx}>{getJuror(juror)}</li>
                                )
                            )}
                        </ul> */}
                    </div>
                </Col>
                <Col md={4} xs={4} sm={4} lg={4}>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <Image width={100} height={100} src={TASK_OPEN_LOGO} />
                    </div>
                </Col>
            </Row>
        </Card.Body>
    );
};

export default FinalJurors;
