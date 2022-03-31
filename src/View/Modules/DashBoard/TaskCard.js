import React, { useEffect, useState } from 'react';
import { Badge, Card, Button, Col, NavLink } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import _ from 'lodash';
import * as constants from './constants';
import { useDispatch, useSelector } from 'react-redux';
import { TASK_STATUS } from '../TaskDetails/constants';
import axios from 'axios';
import Attachments from './Attachments';

const TaskCard = ({ data, showFormModal }) => {
  const history = useHistory();
  const [attributesForCard, setAttributesForCard] = useState({});
  const [cardDetails, setCardDetails] = useState({
    taskId: null,
    client: null,
    workerId: null,
    taskDeadline: null,
    cost: null,
    status: null,
    taskDescription: null,
    publisherName: null,
    workerName: null,
    startDate: null,
    endDate: null,
    taskTags: [],
    workerAttachments: [],
    publisherAttachments: [],
  });

  const [attachments, setAttachments] = useState({
    showAttachments: false,
    attachments: [],
  });

  const connectedAccounts = useSelector(
    (state) => state.headerReducer.accountsAvailableInWallet
  );
  const defaultAccounts = useSelector(
    (state) => state.headerReducer.defaultAccounts
  );

  // const getAccountName = (address) => {
  //     try {
  //         let res;
  //         if (address === null) return null;
  //         [...connectedAccounts, ...defaultAccounts].forEach((acc, idx) => {
  //             if (address === acc.address) {
  //                 res = acc.meta.name;
  //             }
  //         });
  //         return res;
  //     } catch (error) {
  //         return "Alice";
  //     }
  // };

  const getAttributesForCard = (status) => {
    switch (status) {
      case TASK_STATUS.Completed:
        return {
          badgeColor: 'green',
          button: (
            <Button variant="secondary" name={`Task Successfully Completed`}>
              <b>Task Successfully Completed</b>
            </Button>
          ),
        };
      case TASK_STATUS.InProgress:
        return {
          badgeColor: 'yellow',
          button: [
            <Button
              key={0}
              variant="primary"
              name={constants.FORM_TYPES.COMPLETE_TASK.type}
              onClick={(e) => showFormModal(e, data)}
            >
              <b>Complete</b>
            </Button>,
          ],
        };

      case TASK_STATUS.PendingApproval:
        return {
          badgeColor: 'red',
          button: [
            <Button
              variant="success"
              name={constants.FORM_TYPES.APPROVE_TASK.type}
              onClick={(e) => showFormModal(e, data)}
            >
              <b>Approve</b>
            </Button>,
            <Button
              variant="danger"
              name={constants.FORM_TYPES.APPROVE_TASK.type}
              onClick={(e) => showFormModal(e, data)}
            >
              <b>Disapprove</b>
            </Button>,
            <Button
              key={1}
              variant="warning"
              name={constants.FORM_TYPES.RAISE_DISPUTE.type}
              onClick={(e) => showFormModal(e, data)}
            >
              <b>Raise Dispute</b>
            </Button>,
          ],
        };

      case TASK_STATUS.CustomerRatingPending:
        return {
          badgeColor: 'red',
          button: [
            <Button
              variant="success"
              name={constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type}
              onClick={(e) => showFormModal(e, data)}
            >
              <b>Provide Customer Ratings</b>
            </Button>,
            <Button
              variant="danger"
              name={constants.FORM_TYPES.DISAPPROVE_WORKER_RATINGS.type}
              onClick={(e) => showFormModal(e, data)}
            >
              <b>Disapprove Worker Ratings</b>
            </Button>,
            <Button
              key={1}
              variant="warning"
              name={constants.FORM_TYPES.RAISE_DISPUTE.type}
              onClick={(e) => showFormModal(e, data)}
            >
              <b>Raise Dispute</b>
            </Button>,
          ],
        };
      case TASK_STATUS.CustomerRatingProvided:
        return {
          badgeColor: 'red',
          button: [
            <Button
              variant="success"
              name={constants.FORM_TYPES.CLOSE_TASK.type}
              onClick={(e) => showFormModal(e, data)}
            >
              <b>Close</b>
            </Button>,
            <Button
              variant="danger"
              name={constants.FORM_TYPES.DISAPPROVE_CUSTOMER_RATINGS.type}
              onClick={(e) => showFormModal(e, data)}
            >
              <b>Disapprove Customer Ratings</b>
            </Button>,
            <Button
              key={1}
              variant="warning"
              name={constants.FORM_TYPES.RAISE_DISPUTE.type}
              onClick={(e) => showFormModal(e, data)}
            >
              <b>Raise Dispute</b>
            </Button>,
          ],
        };
      case TASK_STATUS.DisputeRaised:
        return {
          badgeColor: 'red',
          button: (
            <Button
              variant="success"
              name={constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type}
              onClick={(e) => history.push(`/court/${data.taskId}`)}
            >
              <b>Show Court</b>
            </Button>
          ),
        };
      case TASK_STATUS.VodingPeriod:
        return {
          badgeColor: 'red',
          button: (
            <Button
              variant="success"
              name={constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type}
              onClick={(e) => history.push(`/court/${data.taskId}`)}
            >
              <b>Show Court</b>
            </Button>
          ),
        };
      case TASK_STATUS.JuryDecisionReached:
        return {
          badgeColor: 'red',
          button: (
            <Button
              variant="success"
              name={constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type}
              onClick={(e) => history.push(`/court/${data.taskId}`)}
            >
              <b>Show Court</b>
            </Button>
          ),
        };
      case TASK_STATUS.Open:
        return {
          badgeColor: 'blue',
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
        console.log(`----------status: ${status}-------------`);
        return {
          badgeColor: 'blue',
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

  const handleAttachments = (workerAttachments, publisherAttachments) => {
    let tempAttachments = [];
    if (workerAttachments !== null && workerAttachments.length !== 0) {
      for (let i = 0; i < workerAttachments.length; i++) {
        tempAttachments.push(workerAttachments[i]);
      }
    } else if (
      publisherAttachments !== null &&
      publisherAttachments.length !== 0
    ) {
      for (let i = 0; i < publisherAttachments.length; i++) {
        tempAttachments.push(publisherAttachments[i]);
      }
    }

    if (attachments.length !== 0) {
      setAttachments({
        showAttachments: true,
        attachments: tempAttachments,
      });
    }
  };

  const init = () => {
    try {
      // const publisher_name = getAccountName(client);
      // const worker_name = getAccountName(worker_id);

      let today = new Date();
      let startDate = today.toLocaleDateString();
      let endDate = today
        .addDays(parseInt(data.taskDeadline))
        .toLocaleDateString();
      handleAttachments(data.workerAttachments, data.publisherAttachments);
      setCardDetails({
        ...data,
        startDate,
        endDate,
      });
      setAttributesForCard(getAttributesForCard(data.status));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    init();
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
              pathname: `/taskdetails/${cardDetails.taskId}`,
            })
          }
        >
          <Card.Text className="d-flex justify-content-between align-items-center">
            <b>{_.capitalize(cardDetails.taskDescription)}</b>
            <Badge
              variant={attributesForCard.badgeColor}
              className={`px-2 mx-2`}
              style={{
                display: 'table',
                color: `${
                  attributesForCard.badgeColor === 'yellow' ? 'black' : 'white'
                }`,
                backgroundColor: `${attributesForCard.badgeColor}`,
                borderRadius: '10px',
                padding: '0.4rem',
              }}
            >
              {cardDetails.status}
            </Badge>
          </Card.Text>
          <hr />
          <div className="d-flex justify-content-between align-items-center my-1">
            <div>
              <div>
                <b>Publisher</b>
              </div>
              <small style={{ fontSize: '13px' }}>
                {cardDetails.publisherName}
              </small>
            </div>
            {cardDetails.workerId !== null && (
              <div>
                <div>
                  <b>Worker</b>
                </div>
                <small style={{ fontSize: '13px' }}>
                  {cardDetails.workerName}
                </small>
              </div>
            )}
          </div>
          <Card.Text>
            <b>TaskId:</b> {cardDetails.taskId}
          </Card.Text>
          <Card.Text>
            <b>TaskDeadline: </b>
            {cardDetails.taskDeadline} days
          </Card.Text>
          <Card.Text>
            <b>TaskCost:</b> {cardDetails.cost}
          </Card.Text>
          <div>
            <b>TaskTags:</b>
          </div>
          <div>
            {cardDetails.taskTags.map((tag, idx) => (
              <Badge
                variant={`secondary`}
                className={`px-2 m-1`}
                style={{
                  color: `${'white'}`,
                  backgroundColor: `${'#272b41'}`,
                  borderRadius: '10px',
                  padding: '0.4rem',
                  fontSize: '10px',
                }}
                key={idx}
              >
                {tag}
              </Badge>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <div>
                <b>Start Date</b>
              </div>
              <small>{cardDetails.startDate}</small>
            </div>
            <div>
              <div>
                <b>End Date</b>
              </div>
              <small>{cardDetails.endDate}</small>
            </div>
          </div>

          {data.dispute !== null && (
            <div className="d-flex justify-content-end align-items-center">
              <Badge
                className={`px-2 m-1`}
                style={{
                  color: `${'white'}`,
                  backgroundColor: `${'#53CBF0'}`,
                  borderRadius: '10px',
                  padding: '0.4rem',
                  fontSize: '10px',
                }}
              >
                Court was Summoned
              </Badge>
            </div>
          )}
        </Card.Body>
        <Card.Footer className="card-footer">
          {attachments.showAttachments && (
            <Attachments
              attachments={attachments.attachments}
              name="Attachments"
            />
          )}
          {attributesForCard.button}
        </Card.Footer>
      </Card>
    </Col>
  );
};

Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

export default TaskCard;
