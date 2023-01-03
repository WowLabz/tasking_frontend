import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { Accordion, List, Icon  } from "semantic-ui-react";
import closedImg from './static/closed.png';

const CourtSummary = (props) => {

  const dispute = props.dispute;
  const [ activeIndex, setActiveIndex ] = useState(-1);

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
          style={{'background-color':'#f2f2f2'}}
        >
          <Icon name="dropdown" />
          <b>Court Summary</b>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0} >
          <div style={{'display': 'flex', 'justify-content': 'space-between'}}>
            <List bulleted style={{'margin-top':'10px', 'padding':'5px'}}>
              <List.Item>
                Votes For Customer: {dispute.votesForCustomer ? dispute.votesForCustomer : 0 }
              </List.Item>
              <List.Item>
                Votes For Worker: {dispute.votesForWorker ? dispute.votesForWorker : 0 }
              </List.Item>
              <List.Item>
                Winner: { dispute.winner ? dispute.winner : "N/A"}
              </List.Item>
            </List>
          {dispute.winner && ( <div>
              <Image src={closedImg} style={{'height': '60px', 'margin-top': '15px'}}/>
            </div>)}
          </div>
        </Accordion.Content>
    </Accordion>
    </>
  );
};

export default CourtSummary;