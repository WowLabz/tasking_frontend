import React, { useState } from "react";
import { Badge, Button, Card } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { MILESTONE_STATUS } from "./constants";
import ConfirmModal from "../../../Utilities/ConfirmModal";

export const getAttributesForCard = (project, props) => {
  const attribute = {};

  const addMilestoneButton = (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        props.setShowModel({ show: true, index: -1 });
      }}
      key={"modal"}
    >
      Add Milestone
    </Button>
  );

  const addToMarketplaceButton = (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        // props.setShowConfirmModalMarketplace(true);
        props.setShowConfirmModal({
          show: true,
          onClickHandler: props.onAddProjectToMarketplace,
        });
        // props.onAddProjectToMarketplace(e)
      }}
      key={"marketplace"}
    >
      Add to marketplace
    </Button>
  );

  const closeProjectButton = (
    <Button
      variant="danger"
      onClick={(e) => {
        e.stopPropagation();
        props.setShowConfirmModal({
          show: true,
          onClickHandler: props.onCloseProject,
        });
      }}
      // onClick={ (e) => props.onCloseProject(e) }
      key={"close"}
    >
      Close Project
    </Button>
  );

  attribute.button = [];
  switch (project.status) {
    case "Ready":
      attribute.badgeColor = "yellow";
      attribute.button.push(addToMarketplaceButton);
      if (project.milestones.length < 5) {
        attribute.button.push(addMilestoneButton);
      }
      break;
    case "Open":
      attribute.badgeColor = "green";
      let flag = true;
      for (let i = 0; i < project.milestones.length; i++) {
        const milestone = project.milestones[i];
        if (
          milestone.status != MILESTONE_STATUS.Open &&
          milestone.status != MILESTONE_STATUS.Completed
        ) {
          flag = false;
          break;
        }
      }
      if (flag) attribute.button.push(closeProjectButton);
      break;
    case "Closed":
      attribute.badgeColor = "grey";
      break;
  }
  return attribute;
};

export const ProjectDetailCard = (props) => {
  const project = props.project;

  const history = useHistory();

  // add project to marketplace modal show
  // const [ showConfirmModalMarketplace, setShowConfirmModalMarketplace ] = useState(false);
  // // close project modal show
  // const [ showConfirmModalCloseProject, setShowConfirmModalCloseProject ] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState({
    show: false,
    onClickHandler: null,
  });

  const attributes = getAttributesForCard(project, {
    ...props,
    setShowConfirmModal,
  });

  return (
    <>
      <Card
        className="text-left p-1 d-flex justify-content-between"
        style={{ width: "300px", height: "400px", margin:'15px' }}
      >
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3>{project.projectName}</h3>
            </div>
            <div>
              <Badge
                variant={attributes.badgeColor}
                className="px-2 mx-2"
                style={{
                  display: "table",
                  color: `${
                    attributes.badgeColor === "yellow" ? "black" : "white"
                  }`,
                  backgroundColor: `${attributes.badgeColor}`,
                  borderRadius: "10px",
                  padding: "0.4rem",
                }}
              >
                {project.status}
              </Badge>
            </div>
          </div>
        </Card.Header>
        <Card.Body
          onClick={(event) =>
            history.push(`/projectdetails/${project.projectId}`)
          }
        >
          <div className="d-flex justify-content-between align-items-center my-1">
            <Card.Text>
              <b>Project Id:</b> {project.projectId}
            </Card.Text>
          </div>
          <Card.Text>
            <b>Publisher Name:</b> {project.publisherName}
          </Card.Text>
          <div>
            <b>Tags:</b>
          </div>
          <div>
            {project.tags.map((tag, idx) => (
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
          <br />
          <Card.Text>
            <b>Number of milestones:</b> {project.milestones.length}
          </Card.Text>
        </Card.Body>
        <Card.Footer className="card-footer">
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ margin: "10px" }}
          >
            {attributes.button}
          </div>
        </Card.Footer>
      </Card>

      {/* These modals are for user confirmation 
                First one when user clicks the button add to marketplace
                Second one is when user clicks the button close project
            */}
      <ConfirmModal
        show={showConfirmModal.show}
        handleClose={() => {
          setShowConfirmModal({
            show: false,
            onClickHandler: null,
          });
        }}
        // onClickHandler={props.onAddProjectToMarketplace}
        onClickHandler={showConfirmModal.onClickHandler}
      />
      {/* <ConfirmModal 
                show={showConfirmModalCloseProject}
                setShow={setShowConfirmModalCloseProject}
                onClickHandler={props.onCloseProject}
            /> */}
    </>
  );
};
