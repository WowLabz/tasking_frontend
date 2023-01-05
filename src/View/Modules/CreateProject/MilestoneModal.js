import React from "react";
import { Modal } from "react-bootstrap";

import MilestoneForm from "./MilestoneForm";

const MilestoneModal = (props) => {
  const showModel = props.showModel;
  const setShowModel = props.setShowModel;
  const filteredTags = props.filteredTags;
  const index = showModel.index;
  const title = index != -1 ? "Edit Milestone" : "Add Milestone";

  const onMilestoneCreate = props.onMilestoneCreate;

  const onMilestoneDelete = props.onMilestoneDelete;

  return (
    <Modal
      show={showModel.show}
      onHide={() => setShowModel({ show: false, index: -1 })}
      onClick={(e) => e.stopPropagation()}
    >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <MilestoneForm
          tags={filteredTags}
          title={title}
          setShowModel={setShowModel}
          onFormSubmit={onMilestoneCreate}
          onFormDelete={onMilestoneDelete}
          {...props}
        />
      </Modal.Body>
    </Modal>
  );
};

export default MilestoneModal;
