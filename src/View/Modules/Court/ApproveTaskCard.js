import React from "react";
import { Card, Col, Image, Row } from "react-bootstrap";
import { TASK_APPROVED_LOGO } from "../../../constants/constants";

const ApproveTaskCard = () => {
    
    return (
        <Card.Body>
            <Row>
                <Col md={8} xs={8} sm={8} lg={8}>
                    <div
                        className="d-flex flex-column justify-content-start align-items-start"
                        style={{ gap: "10px" }}
                    >
                        <ul>
                            <li>Publisher Approved Task</li>
                        </ul>
                    </div>
                </Col>
                <Col md={4} xs={4} sm={4} lg={4}>
                    <div className="d-flex flex-column justify-content-center align-items-center">
                        <Image width={100} height={100} src={TASK_APPROVED_LOGO}/>
                    </div>
                </Col>
            </Row>
        </Card.Body>
    );
};

export default ApproveTaskCard;
