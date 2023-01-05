import React, { useState } from "react";
import { Accordion, List, Icon, Button } from "semantic-ui-react";

import { getJuror } from "./helpers";

const SudoJuror = (props) => {
  const dispute = props.dispute;
  const user = props.user;
  const juror = dispute.sudoJuror;
  const onClickHandler = props.onClickHandler;

  const [activeIndex, setActiveIndex] = useState(0);

  const handleAccordionClick = (event, titleProps) => {
    const { index } = titleProps;
    const newIndex = activeIndex === index ? -1 : index;
    setActiveIndex(newIndex);
  };

  return (
    <>
      <Accordion fluid styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={handleAccordionClick}
          style={{ "background-color": "#f2f2f2" }}
        >
          <Icon name="dropdown" />
          <b>Sudo Juror</b>
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <List bulleted>
            <List.Item>
              <div>{getJuror(juror)}</div>
              <div>
                {user.address === juror ? (
                  <Button
                    basic
                    floated="right"
                    color="blue"
                    onClick={(e) => {
                      props.setShowVoteModal({
                        show: true,
                        onClickHandler: onClickHandler,
                      });
                    }}
                  >
                    Cast Vote
                  </Button>
                ) : null}
              </div>
              <br />
            </List.Item>
          </List>
        </Accordion.Content>
      </Accordion>
    </>
  );
};

export default SudoJuror;
