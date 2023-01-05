import React from "react";
import { Segment, Container, Header, List } from "semantic-ui-react";
import { convertCost } from "../../../Utilities/convertCost";
import { MILESTONE_STATUS } from "./constants";
import { getJuror } from "../Court/helpers";

const EscrowDetails = (props) => {
  const { bidderList, milestone, publisher } = props;
  const milestoneCost = convertCost(milestone.cost);
  const escrowAmount = () => {
    let amount = milestoneCost;
    switch (milestone.status) {
      case MILESTONE_STATUS.Open:
        amount = amount + bidderList.length * milestoneCost;
        break;
      case MILESTONE_STATUS.InProgress:
        amount = amount + milestoneCost;
        break;
      case MILESTONE_STATUS.Completed:
        amount = 0;
        break;
      default:
        amount = amount + milestoneCost;
    }
    return amount;
  };
  const bidsEscrow = bidderList.map((bid) => {
    return (
      <List.Item>
        {bid.bidderName} bid, <i>added</i> {milestoneCost} Units
      </List.Item>
    );
  });
  const getFinalJurorcount = (finalJuror) => {
    let count = 0;
    Object.keys(finalJuror).map((value) => {
      count++;
      return null;
    });
    return count;
  };
  return (
    <Container>
      <Segment>
        <Header>Escrow Details</Header>
        <div
          style={{
            "background-color": "yellow",
            display: "inline-block",
            border: "2px solid yellow",
          }}
        >
          Outstanding Amount: {escrowAmount()} Units
        </div>
        <div>
          Escrow History
          <List bulleted>
            <List.Item>
              Milestone Created <i>added</i> {milestoneCost} Units by{" "}
              {milestone.publisherName}
            </List.Item>
            {bidderList.length > 0 && bidsEscrow}
            {milestone.status !== MILESTONE_STATUS.Open && (
              <List.Item>
                Bid Accepted <i>added</i> {milestoneCost} Units from{" "}
                {milestone.workerName}
              </List.Item>
            )}
            {milestone.status === MILESTONE_STATUS.Completed &&
              !milestone.dispute && (
                <List.Item>
                  Milestone Completed <i>transferred</i> {2 * milestoneCost}{" "}
                  Units to {milestone.workerName}
                </List.Item>
              )}
            {milestone.status === MILESTONE_STATUS.Completed &&
              milestone.dispute !== null &&
              Object.keys(milestone.dispute.finalJurors).map((juror) => {
                let courtFees = milestoneCost * 0.6 * 2;
                const jurorCount = getFinalJurorcount(
                  milestone.dispute.finalJurors
                );
                return (
                  <List.Item>
                    Juror Fees <i>transferred</i> {courtFees / jurorCount} Units
                    to {getJuror(juror)}
                  </List.Item>
                );
              })}
            {milestone.status === MILESTONE_STATUS.Completed &&
              milestone.dispute !== null && (
                <List.Item>
                  Court Adjourned <i>transferred</i> {milestoneCost * 0.4 * 2}{" "}
                  Units to{" "}
                  {milestone.dispute.winner === "Worker"
                    ? milestone.workerName
                    : publisher}
                </List.Item>
              )}
          </List>
        </div>
      </Segment>
    </Container>
  );
};

export default EscrowDetails;
