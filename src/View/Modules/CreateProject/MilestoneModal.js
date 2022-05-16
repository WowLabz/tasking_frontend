import React from "react";
import { Modal } from "react-bootstrap";

import MilestoneForm from "./MilestoneForm";

const MilestoneModal = (props) => {
    const showModel = props.showModel;
    const setShowModel = props.setShowModel;
    const filteredTags = props.filteredTags;
    const index = showModel.index;
    const title = index != -1 ? "Edit Milestone" : "Add Milestone";
    return (
        <Modal show={showModel.show}  onHide={()=>setShowModel({show:false, index: -1})}>
                <Modal.Header>
                    <Modal.Title>
                        {title}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MilestoneForm 
                        tags={filteredTags}
                        title={title}
                        setShowModel={setShowModel}
                        {...props}  
                    />
                </Modal.Body>
            </Modal>
    );
};

export default MilestoneModal;