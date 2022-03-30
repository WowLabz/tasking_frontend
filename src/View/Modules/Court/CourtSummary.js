import React, { useState, useEffect } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { DEFAULT_SUBSTRATE_ACCOUNTS_IDS, TASK_STATUS } from './constants';
import { getAttributesForCard } from '../DashBoard/helpers';
import { useSelector } from 'react-redux';

const CourtSummary = ({ tab }) => {
  const [attributesForCard, setAttributesForCard] = useState({});
  const { tabId, tabType, task } = tab;
  const tasks = useSelector((state) => state.dashBoardReducer.tasks);

  const {
    client,
    cost,
    status,
    taskDeadline,
    taskDescription,
    taskId,
    workerId,
  } = task;

  let reduxTask = tasks.filter((task) => task.taskId === taskId)[0];
  useEffect(() => {
    reduxTask = tasks.filter((task) => task.taskId === taskId)[0];
  }, [tasks]);

  const init = () => {
    setAttributesForCard(getAttributesForCard(status));
  };

  useEffect(() => {
    init();
    return () => {};
  }, []);

  const { votesForCustomer, votesForWorker, winner } = reduxTask?.dispute;

  return (
    <Card.Body>
      <Row>
        <Col md={8} xs={8} sm={8} lg={8}>
          <div
            className="d-flex flex-column justify-content-start align-items-start"
            style={{ gap: '10px' }}
          >
            <ul>
              <li>
                Votes For Customer: {votesForCustomer ? votesForCustomer : 0}
              </li>
              <li>Votes For Worker: {votesForWorker ? votesForWorker : 0}</li>

              <li>Winner: {winner ? winner : 'N.A.'}</li>
            </ul>
          </div>
        </Col>
      </Row>
    </Card.Body>
  );
};

export default CourtSummary;
