import React, { useState } from "react";
import { Modal, Badge } from "react-bootstrap";
import {  Segment, Card, Accordion, Icon, Header, List, Grid, Button} from 'semantic-ui-react'



const BidderList = (props) => {
    const bidderList = props.bidderList;
    const show = props.show;
    const setShow = props.setShow;

    const handleClose = () => setShow(false);
    

    return (
        <Modal
            show={show}
            onHide={handleClose}
        >
            <Modal.Header>
                <Modal.Title>Bidder List</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Segment style={{overflow:'scroll',width:'fit-content'}}>
                    <Card.Group >
                        { bidderList.map((bidder,idx) => {
                            return (
                                <Card style={{width:'fit-content'}} key={idx}>
                                    <Card.Content>
                                        <Card.Header>{bidder.bidderName}</Card.Header>
                                        <Card.Meta>Bid Number: {bidder.bidNumber}</Card.Meta>
                                        <Card.Description>
                                            <List bulleted>
                                                <List.Item>
                                                    Bidder Id: {bidder.bidderId}
                                                </List.Item>
                                                <List.Item>
                                                    Average Rating: {bidder.account.avgRating}
                                                </List.Item>
                                                <List.Item>
                                                    Account Balance: {bidder.account.balance}
                                                </List.Item>
                                                <div>
                                                    <b>Tags:</b>
                                                </div>
                                                {bidder.account.tags.map((tag,idx) => (
                                                    <Badge
                                                        variant={`secondary`}
                                                        className={`px-2 m-1`}
                                                        style={{
                                                        color: `${'white'}`,
                                                        backgroundColor: `${'#272b41'}`,
                                                        borderRadius: '10px',
                                                        padding: '0.4rem',
                                                        fontSize: '10px',
                                                        }}
                                                        key={idx}
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ) )}
                                            </List>
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <Button 
                                            floated="right"
                                            basic
                                            color="green"
                                            onClick={(event) => {
                                                event.preventDefault();
                                                event.stopPropagation();
                                                props.handleAcceptBid(bidder.bidNumber);
                                                handleClose();
                                            }}
                                        >
                                            Accept Bid
                                        </Button>
                                    </Card.Content>
                                </Card>
                            );
                        })}
                    </Card.Group>
                </Segment>
            </Modal.Body>
        </Modal>
    );
};

export default BidderList;