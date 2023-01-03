import React, { useEffect, useState } from 'react'
import { Badge, Card, Col, Image, Row } from 'react-bootstrap'
import { TASK_CLOSED_LOGO } from '../../../constants/constants';
import { getAttributesForCard } from '../DashBoard/helpers';


const RatingsForTaskTask = ({tab}) => {
    const [attributesForCard, setAttributesForCard] = useState({});
    const { task } = tab;
    const {
        cost,
        status,
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
                        <ul>
                            <li>
                                Worker Id: <small>{workerId}</small>
                            </li>
                        </ul>
                        <Badge
                            pill
                            style={{
                                color: "black",
                                background: "#ffc107",
                                fontSize: "14px",
                            }}
                        >
                            Amount Unlocked from Escrow To Worker:{" "}
                            {cost}
                        </Badge>
                        <Badge
                            pill
                            style={{
                                color: "white",
                                background: "#198754",
                                fontSize: "14px",
                            }}
                        >
                            Amount Transferred To Worker:{" "}
                            {cost}
                        </Badge>
                    </div>
                </Col>
                <Col md={4} xs={4} sm={4} lg={4}>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <Image width={100} height={100} src={TASK_CLOSED_LOGO}/>
                    </div>
                </Col>
            </Row>
            
        </Card.Body>
    )
}

export default RatingsForTaskTask