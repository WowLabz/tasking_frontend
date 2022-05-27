import React from "react";
import { Button, Modal } from "react-bootstrap";

const ConfirmModal = (props) => {
    const show = props.show;
    const setShow = props.setShow;
    const onClickHandler = props.onClickHandler;

    const handleClose = () => props.handleClose();
    return (
        <Modal show={show}
            onClick={(e) => e.stopPropagation()}
        >
            <Modal.Header>
                <Modal.Title>Confirm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Are you sure you want to do this ?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={ (e) => {
                    e.stopPropagation();
                    handleClose();
                }}>
                    No, go back
                </Button>
                <Button variant="info" onClick={e => {
                    e.stopPropagation();
                    onClickHandler();
                    handleClose();
                }}>
                    Yes, go ahead
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmModal;