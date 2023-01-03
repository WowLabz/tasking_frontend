import React, { useState, useEffect } from "react";
import { Modal, Form, FormControl, Card, Button } from "react-bootstrap";
import { Dropdown } from "semantic-ui-react";




const VoteModal = (props) => {
    const show = props.show;
    const handleClose = props.handleClose;
    const user = props.user;
    const milestoneId = props.milestone.milestoneId;
    const onClickHandler = props.onClickHandler;

    const votedForOptions = [
        {
            key: "Worker",
            text: "Worker",
            value: "Worker"
        },
        {
            key: "Customer",
            text: "Customer",
            value: "Customer"
        },
    ];

    
    const [voteDetails, setVoteDetails] = useState({
        accountId: user.address,
        milestoneId: milestoneId,
        votedFor: null,
        customerRating: 1,
        workerRating: 1
    });
    
    const [ valid, setValid ] = useState(false);
    
    const validateForm = () => {
        const { votedFor, customerRating, workerRating } = voteDetails;
        return votedFor && (customerRating >=1 && customerRating <= 5) && ( workerRating >=1 && workerRating <=5);
    }

    useEffect(() => {
        if(validateForm()){
            setValid(true);
        }
    }, [voteDetails]);

    useEffect(() => {
        const tempVoteDetails = {...voteDetails};
        tempVoteDetails.accountId = user.address;
        setVoteDetails(tempVoteDetails);
    },[user])

    return (
        <>
            <Modal show={show}
                onHide={handleClose}
            >
                <Modal.Header>
                    <Modal.Title>Cast your vote.</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Card className="text-left form p-1">
                            <Card.Body className="form-body" style={{ overflow: 'scroll'}}>
                                <Form.Label>Account Id</Form.Label>
                                <FormControl
                                    readOnly={true}
                                    type="text"
                                    placeholder="Account Id"
                                    value={user.address}
                                    disabled={true}
                                />
                                <br />
                                <Form.Label>Milestone Id</Form.Label>
                                <FormControl
                                    readOnly
                                    type="text"
                                    placeholder="Milestone Id"
                                    value={milestoneId}
                                    disabled={true}
                                />
                                <br />
                                <Form.Label>Voting For</Form.Label>
                                <Dropdown
                                    placeholder="Voting For"
                                    fluid
                                    selection
                                    options={votedForOptions}
                                    onChange={(e,{value}) => {
                                        const tempVoteDetails = {...voteDetails};
                                        tempVoteDetails.votedFor = value;
                                        setVoteDetails(tempVoteDetails);  
                                    }}
                                />
                                <br />
                                <Form.Label>Customer Rating</Form.Label>
                                <FormControl 
                                    required
                                    type="number"
                                    placeholder="Rating for customer"
                                    value={voteDetails.customerRating}
                                    onChange={e => {
                                        const tempVoteDetails = {...voteDetails};
                                        tempVoteDetails.customerRating = e.target.value;
                                        setVoteDetails(tempVoteDetails);
                                    }}
                                />
                                <br />
                                <Form.Label>Worker Rating</Form.Label>
                                <FormControl 
                                    required
                                    type="number"
                                    placeholder="Rating for worker"
                                    value={voteDetails.workerRating}
                                    onChange={e => {
                                        const tempVoteDetails = {...voteDetails};
                                        tempVoteDetails.workerRating = e.target.value;
                                        setVoteDetails(tempVoteDetails);
                                    }}
                                />
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between aligin-items-center">
                                <Button
                                    disabled={!valid}
                                    onClick={e => {
                                        onClickHandler(voteDetails);
                                        handleClose();
                                    }}
                                >
                                    Cast Vote
                                </Button>
                            </Card.Footer>
                        </Card>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default VoteModal;