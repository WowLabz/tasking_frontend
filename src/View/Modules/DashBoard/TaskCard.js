import React, { useEffect, useState } from "react";
import { Badge, Card, Button, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import _ from "lodash";
import * as constants from "./constants";
import { useSelector } from "react-redux";
import { TASK_STATUS } from "../TaskDetails/constants";
import BalanceImg from "../../../assets/images/balance.png";
import { convertCost } from "../../../Utilities/convertCost";
import { toast } from "react-toastify";

const TaskCard = ({ data, showFormModal, isWalletConnected, toast }) => {
  const history = useHistory();
  const [attributesForCard, setAttributesForCard] = useState({});
  const [cardDetails, setCardDetails] = useState({
    milestoneId: null,
    client: null,
    workerId: null,
    deadline: null,
    cost: null,
    status: null,
    milestoneName: null,
    publisherName: null,
    workerName: null,
    startDate: null,
    endDate: null,
    tags: [],
    workerAttachments: [],
    publisherAttachments: [],
    projectId: null,
    milestoneNumber: null,
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

  const checkForWalletConnected = () => {
    if (!isWalletConnected) return false;
    return true;
  };

  const onClickHandler = (pathname) => {
    if (checkForWalletConnected()) {
      return history.push({ pathname });
    } else {
      toast.error("Connect Crypto Wallet");
    }
  };

  const getAttributesForCard = (status) => {
    switch (status) {
      case TASK_STATUS.Completed:
        return {
          badgeColor: "green",
          button: (
            <Button variant="secondary" name={`Task Successfully Completed`}>
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
              onClick={(e) =>
                onClickHandler(`/projectdetails/${cardDetails.projectId}`)
              }
            >
              <b>Complete</b>
            </Button>,
          ],
        };

      case TASK_STATUS.PendingApproval:
        return {
          badgeColor: "red",
          button: [
            <Button
              variant="success"
              name={constants.FORM_TYPES.APPROVE_TASK.type}
              onClick={(e) =>
                onClickHandler(`/projectdetails/${cardDetails.projectId}`)
              }
            >
              <b>Approve</b>
            </Button>,
            <Button
              variant="danger"
              name={constants.FORM_TYPES.APPROVE_TASK.type}
              onClick={(e) =>
                onClickHandler(`/projectdetails/${cardDetails.projectId}`)
              }
            >
              <b>Disapprove</b>
            </Button>,
          ],
        };

      case TASK_STATUS.CustomerRatingPending:
        return {
          badgeColor: "red",
          button: [
            <Button
              variant="success"
              name={constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type}
              onClick={(e) =>
                onClickHandler(`/projectdetails/${cardDetails.projectId}`)
              }
            >
              <b>Provide Customer Ratings</b>
            </Button>,
            <Button
              variant="danger"
              name={constants.FORM_TYPES.DISAPPROVE_WORKER_RATINGS.type}
              onClick={(e) =>
                onClickHandler(`/projectdetails/${cardDetails.projectId}`)
              }
            >
              <b>Disapprove Worker Ratings</b>
            </Button>,
          ],
        };
      case TASK_STATUS.CustomerRatingProvided:
        return {
          badgeColor: "red",
          button: [
            <Button
              variant="success"
              name={constants.FORM_TYPES.CLOSE_TASK.type}
              onClick={(e) =>
                onClickHandler(`/projectdetails/${cardDetails.projectId}`)
              }
            >
              <b>Close</b>
            </Button>,
            <Button
              variant="danger"
              name={constants.FORM_TYPES.DISAPPROVE_CUSTOMER_RATINGS.type}
              onClick={(e) =>
                onClickHandler(`/projectdetails/${cardDetails.projectId}`)
              }
            >
              <b>Disapprove Customer Ratings</b>
            </Button>,
          ],
        };
      case TASK_STATUS.DisputeRaised:
        return {
          badgeColor: "red",
          button: (
            <Button
              variant="success"
              name={constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type}
              onClick={(e) => onClickHandler(`/court/${data.milestoneId}`)}
            >
              <b>Show Court</b>
            </Button>
          ),
        };
      case TASK_STATUS.VodingPeriod:
        return {
          badgeColor: "red",
          button: (
            <Button
              variant="success"
              name={constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type}
              onClick={(e) => onClickHandler(`/court/${data.milestoneId}`)}
            >
              <b>Show Court</b>
            </Button>
          ),
        };
      case TASK_STATUS.JuryDecisionReached:
        return {
          badgeColor: "red",
          button: (
            <Button
              variant="success"
              name={constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type}
              onClick={(e) => onClickHandler(`/court/${data.milestoneId}`)}
            >
              <b>Show Court</b>
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
              onClick={(e) =>
                onClickHandler(`/projectdetails/${cardDetails.projectId}`)
              }
            >
              <b>Bid</b>
            </Button>
          ),
        };
      default:
        console.log(`----------status: ${status}-------------`);
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

  const getProjectIdAndMilestoneNumber = ({ milestoneId }) => {
    const projectId = milestoneId.slice(0, -1);
    const milestoneNumber =
      milestoneId
        .slice(milestoneId.length - 1, milestoneId.length)
        .charCodeAt(0) - 97;
    return [projectId, milestoneNumber];
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
      handleAttachments(data.workerAttachments, data.publisherAttachments);
      const [projectId, milestoneNumber] = getProjectIdAndMilestoneNumber(data);
      setCardDetails({
        ...data,
        projectId,
        milestoneNumber,
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
      <Card className="task-card  p-4" style={{ width: "fit-content" }}>
        <Card.Body
          onClick={() => {
            onClickHandler(`/projectdetails/${cardDetails.projectId}`);
          }}
        >
          <Card.Text className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <b>{_.capitalize(cardDetails.milestoneName)}</b>
              {data.dispute !== null && (
                <img
                  src={BalanceImg}
                  alt="balance"
                  width={20}
                  height={20}
                  style={{ marginLeft: "8px", marginTop: "-9px" }}
                />
              )}
            </div>
            <Badge
              variant={attributesForCard.badgeColor}
              className={`px-2 mx-2`}
              style={{
                display: "table",
                color: `${
                  attributesForCard.badgeColor === "yellow" ? "black" : "white"
                }`,
                backgroundColor: `${attributesForCard.badgeColor}`,
                borderRadius: "10px",
                padding: "0.4rem",
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
              <small style={{ fontSize: "13px" }}>
                {cardDetails.publisherName}
              </small>
            </div>
            {cardDetails.workerId !== null && (
              <div>
                <div>
                  <b>Worker</b>
                </div>
                <small style={{ fontSize: "13px" }}>
                  {cardDetails.workerName}
                </small>
              </div>
            )}
          </div>
          <Card.Text>
            <b>milestoneId:</b> {cardDetails.milestoneId}
          </Card.Text>
          <Card.Text>
            <b>deadline: </b>
            {cardDetails.deadline} days
          </Card.Text>
          <Card.Text>
            <b>TaskCost:</b> {convertCost(cardDetails.cost)} Units
          </Card.Text>
          <div>
            <b>tags:</b>
          </div>
          <div>
            {cardDetails.tags.map((tag, idx) => (
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
        </Card.Body>
        <Card.Footer className="card-footer">
          {cardDetails.publisherAttachments &&
          cardDetails.publisherAttachments.length !== 0 ? (
            <a href={cardDetails.publisherAttachments} target="_blank">
              Publisher Attachments
            </a>
          ) : null}
          {cardDetails.workerAttachments &&
          cardDetails.workerAttachments.length !== 0 ? (
            <a href={cardDetails.workerAttachments} target="_blank">
              Worker Attachments
            </a>
          ) : null}
          <br />
          {attributesForCard.button}
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default TaskCard;
