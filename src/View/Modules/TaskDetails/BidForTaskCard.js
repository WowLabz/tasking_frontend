import React, { useEffect, useState } from 'react'
import { Badge, Card, Col, Row } from 'react-bootstrap'
import { getAttributesForCard } from '../DashBoard/helpers';
import { TASK_STATUS } from './constants';

const BidForTaskCard = ({tab}) => {
    const [attributesForCard, setAttributesForCard] = useState({});
    const { tabId, tabType, task } = tab;
    const {
        client,
        cost,
        status,
        task_deadline,
        task_description,
        task_id,
        worker_id,
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
                        <ul>
                            <li>
                                Worker Id: <small>{worker_id}</small>
                            </li>
                            {/* <li>Worker Escrow Amt: {cost}</li> */}
                        </ul>
                        <Badge
                            pill
                            style={{
                                color: "black",
                                background: "#ffc107",
                                fontSize: "14px",
                            }}
                        >
                            Worker Escrow:{" "}
                            {status === TASK_STATUS.Completed ? "0" : cost}
                        </Badge>
                    </div>
                </Col>
                <Col md={4} xs={4} sm={4} lg={4}>
                    <div className="d-flex flex-column justify-content-center">

                    </div>
                </Col>
            </Row>
            
        </Card.Body>
    )
}

export default BidForTaskCard
