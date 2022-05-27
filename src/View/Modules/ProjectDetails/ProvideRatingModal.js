import React, { useState, useEffect } from "react";
import { Modal, Form, FormControl } from "react-bootstrap";
import { Button, Segment } from "semantic-ui-react";

const ProvideRatingModal = (props) => {
    
    const show = props.show;
    const title = props.title;
    const label = props.label;
    const onClickHandler = props.onClickHandler;

    const [ rating, setRating ] = useState(1);
    const [ error, setError ] = useState('');
    const [ valid, setValid ] = useState(false);

    useEffect(() => {
        if(! rating>=1 && rating<=5 ){
            setValid(false);
            setError('Rating can be between 1 to 5');
        }else{
            setValid(true);
            setError('');
        }
    }, [rating])
    
    const handleClose = () => props.handleClose();
    
    return (
        <>
            <Modal
                show={show}
            >
                <Modal.Header>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Segment>
                        <Form>
                            <Form.Label>{label}</Form.Label>
                        </Form>
                        <FormControl
                            required
                            type="number"
                            placeholder={label}
                            value={rating}
                            onChange={e => setRating(e.target.value)}
                            isInvalid={!!error}
                        />
                        <Form.Control.Feedback type="invalid">
                            {error}
                        </Form.Control.Feedback>
                    </Segment>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        disabled={!valid}
                        onClick={event => {
                            event.preventDefault();
                            event.stopPropagation();
                            onClickHandler(rating);
                            handleClose();
                        }}
                    >
                        Provide Rating
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProvideRatingModal;