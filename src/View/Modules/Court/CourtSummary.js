import React, { useState } from "react";
import { Accordion, List, Icon  } from "semantic-ui-react";


const CourtSummary = (props) => {

  const dispute = props.dispute;
  const [ activeIndex, setActiveIndex ] = useState(0);

  const handleAccordionClick = (event, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);

  }
  return (
    <>
      <Accordion
        fluid
        styled
      >
        <Accordion.Title
          active={activeIndex===0}
          index={0}
          onClick={handleAccordionClick}
        >
          <Icon name="dropdown" />
          <b>Court Summary</b>
        </Accordion.Title>
        <Accordion.Content active={activeIndex===0}>
          <List>
            <List.Item>
              Votes For Customer: {dispute.votesForCustomer ? dispute.votesForCustomer : 0 }
            </List.Item>
            <List.Item>
              Votes For Worker: {dispute.votesForWorker ? dispute.votesForWorker : 0 }
            </List.Item>
            <List.Item>
              Winer: { dispute.winner ? dispute.winner : "N/A"}
            </List.Item>
          </List>
        </Accordion.Content>
    </Accordion>
    </>
  );
};

export default CourtSummary;