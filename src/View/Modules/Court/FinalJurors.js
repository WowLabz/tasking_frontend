import React, { useState } from "react";
import { Accordion, List, Icon, Button, Segment } from "semantic-ui-react";

import { getJuror } from "./helpers";


const FinalJurors = (props) => {
  const dispute = props.dispute;

  const [ activeIndex, setActiveIndex ] = useState(0);

  const handleAccordionClick = (event, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  }

  console.log(dispute.finalJurors);

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
          <b>Final Jurors</b>
        </Accordion.Title>
        <Accordion.Content
          active={activeIndex===0}
        >
          <List bulleted>
            { Object.keys(dispute.finalJurors).map((juror,idx) => {
              return(
                <List.Item key={idx}>
                  {getJuror(juror)}
                  <List bulleted>
                    <List.Item>
                      Voted for: {dispute.finalJurors[juror].votedFor}
                    </List.Item>
                    <List.Item>
                      Publisher Rating: {dispute.finalJurors[juror].publisherRating}
                    </List.Item>
                    <List.Item>
                      Worker Rating: {dispute.finalJurors[juror].workerRating}
                    </List.Item>
                  </List>
                </List.Item>
              );
            })}
          </List>
        </Accordion.Content>
      </Accordion>
    </>
  );

}

export default FinalJurors;