import React, { useState } from "react";
import { Badge } from "react-bootstrap";
import { Accordion, List, Icon, Segment, Header } from "semantic-ui-react";
import { convertCost } from "../../../Utilities/convertCost";

import "react-circular-progressbar/dist/styles.css";

const CourtDetails = (props) => {
  const milestone = props.milestone;
  const dispute = milestone.dispute;

  const [activeIndex, setActiveIndex] = useState(0);

  const handleAccordionClick = (event, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  return (
    <Accordion fluid styled>
      <Accordion.Title
        active={activeIndex === 0}
        index={0}
        onClick={handleAccordionClick}
      >
        <Icon name="dropdown" />
        <b>Court Details</b>
      </Accordion.Title>
      <Accordion.Content active={activeIndex === 0}>
        <Segment>
          <Header>{milestone.milestoneName}</Header>
          <List bulleted>
            <List.Item>Milestone Id: {milestone.milestoneId}</List.Item>
            <List.Item>Publisher: {milestone.publisherName}</List.Item>
            <List.Item>Worker: {milestone.workerName}</List.Item>
            <List.Item>Deadline: {milestone.deadline} days</List.Item>
            <List.Item>Cost: {convertCost(milestone.cost)} Units</List.Item>
            {dispute.winner && dispute.winner.length > 0 && (
              <List.Item
                style={{
                  "background-color": "green",
                  display: "inline-block",
                  border: "2px solid green",
                  color: "white",
                  margin: "3px",
                  padding: "3px",
                }}
              >
                Winner:{" "}
                {dispute.winner === "Worker"
                  ? milestone.workerName
                  : milestone.publisherName}
              </List.Item>
            )}
          </List>
          <div>
            {milestone.tags.map((tag, idx) => (
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
        </Segment>
      </Accordion.Content>
    </Accordion>
  );
};

export default CourtDetails;
