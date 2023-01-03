import React, { useState, useEffect } from "react";
import {  Segment, Accordion, Icon, Header, List, Button} from 'semantic-ui-react'
import { Badge } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { useSubstrateState } from "../../../substrate-lib";
import { 
    getBidderList,
    bidForMilestoneTx, 
    acceptBidTx, 
    approveMilestoneTx, 
    disapproveMilestoneTx, 
    provideCustomerRatingsTx, 
    disapproveRatingTx,
    closeMilestoneTx 
} from "../../../palletTaskingFunctions";
import BidderList from "./BidderList";
import { getAttributesForMilestone } from "../DashBoard/helpers";
import ConfirmModal from "../../../Utilities/ConfirmModal";
import ProvideRatingModal from "./ProvideRatingModal";
import CompleteMilestone from "./CompleteMilestone";
import { MILESTONE_STATUS, USER_TYPE } from "./constants";




const MilestoneDetails = (props) => {

    const { api } = useSubstrateState();
    const history = useHistory(); 

    const index = props.index;
    const handleAccordionClick = props.handleAccordionClick;
    const milestone = props.milestone;
    const activeIndex = props.activeIndex;
    const project = props.project;

    const [ bidderList, setBidderList ] = useState([]);
    const [ showBidderList, setShowBidderList ] = useState(false);
    const [ showConfrimModal, setShowConfirmModal ] = useState({
        show: false,
        onClickHandler: null
    });
    const [ showMilestoneCompletedModal, setShowMilestoneCompletedModal ] = useState(false);
    const [ showProvideRatingModal, setShowProvideRatingModal ] = useState({
        show: false,
        onClickHandler: null,
        title: '',
        label: ''
    })

    useEffect(() => {
        const getListOfBidders = async () => {
            const tempList = await getBidderList(api,milestone.milestoneId);
            if(tempList && tempList.length > 0){
                setBidderList(tempList);
            }
        };
        getListOfBidders();
        
    }, [milestone,api?.query.palletTasking])


    const attributes = getAttributesForMilestone(milestone);

    const onBidForMilestone = async () => {
        await bidForMilestoneTx(api,props.walletUser.address,milestone.milestoneId,props.walletUser.name);
    }

    const handleAcceptBid = async (bidNumber) => {
        await acceptBidTx(api,props.walletUser.address,milestone.milestoneId,bidNumber);
    }

    const handleDisapproveMilestone = async () => {
        await disapproveMilestoneTx(api,props.walletUser.address,milestone.milestoneId);
    }

    const handleApproveMilestone = async (ratingForWorker) => {
        await approveMilestoneTx(api,props.walletUser.address,milestone.milestoneId,ratingForWorker);
    }

    const handleProvideCustomerRating = async (ratingForCustomer) => {
        await provideCustomerRatingsTx(api,props.walletUser.address,milestone.milestoneId,ratingForCustomer);
    }

    const handleDisapproveRating = async () => {
        if(props.walletUser.address === project.publisher) {
            await disapproveRatingTx(api,props.walletUser.address,milestone.milestoneId,USER_TYPE.CUSTOMER);
        }else if(props.walletUser.address === milestone.workerId) {
            await disapproveRatingTx(api,props.walletUser.address,milestone.milestoneId,USER_TYPE.WORKER);
        }
    }

    const handleCloseMilestone = async () => {
        await closeMilestoneTx(api,props.walletUser.address,milestone.milestoneId);
    }
    
    return (
        <div>
            <Accordion.Title
                active={activeIndex===index+1}
                index={index+1}
                onClick={handleAccordionClick}
            >
                <Icon name='dropdown' />
                {`Milestone ${index+1}`}
            </Accordion.Title>
            <Accordion.Content
                active={activeIndex===index+1}
            >
                <Segment>
                    <Header className="d-flex justify-content-between align-items-center">
                        {milestone.milestoneName}
                        <Badge
                            variant={attributes.badgeColor}
                            className={`px-2 mx-2`}
                            style={{
                              display: 'table',
                              color: `${
                                attributes.badgeColor === 'yellow'
                                  ? 'black'
                                  : 'white'
                              }`,
                              backgroundColor: `${attributes.badgeColor}`,
                              borderRadius: '10px',
                              padding: '0.4rem',
                            }}
                        >
                            {attributes.badgeText}
                        </Badge>
                    </Header>
                    <List bulleted>
                        <List.Item>
                            Milestone Id: {milestone.milestoneId}
                        </List.Item>
                        <List.Item>
                            Milestone Cost: {milestone.cost}
                        </List.Item>
                        <List.Item>
                            Milestone Deadline: {milestone.deadline}
                        </List.Item>
                        <List.Item>
                            Publisher Attachment Link: <a href={milestone.publisherAttachments} target="_blank">Link</a>
                        </List.Item>

                        {/* Show bidder List button (Only visible to the publisher) */}
                        { project.status === 'Open' && milestone.status === MILESTONE_STATUS.Open && props.walletUser.address === project.publisher ? (
                            <List.Item>
                                Number of Bids: {bidderList.length}
                                <Button
                                    basic
                                    floated="right"
                                    color="teal"
                                    onClick={event => setShowBidderList(true)}
                                >
                                    Show Bidders
                                </Button>
                            </List.Item>
                        ) : null }


                        { milestone.workerId !== null ? (
                            <List.Item>
                                Worker Id: {milestone.workerId}
                            </List.Item>
                        ) : null }
                        { milestone.workerName !== null ? (
                            <List.Item>
                                Worker: {milestone.workerName}
                            </List.Item>
                        ) : null }

                        { milestone.workerAttachments !== null ? (
                            <List.Item>
                                Worker Attachments Link: {milestone.workerAttachments ? (<a href={milestone.workerAttachments} target="_blank"> Link</a>) : ("N/A") }
                            </List.Item>
                        ) : null }

                        { milestone.finalWorkerRating !== null ? (
                            <List.Item>
                                Final Worker Rating: {milestone.finalWorkerRating}
                            </List.Item>
                        ) : null }
                        { milestone.finalCustomerRating !== null ? (
                            <List.Item>
                                Final Customer Rating: {milestone.finalCustomerRating}
                            </List.Item>
                        ) : null }
                    </List>
                    <div>
                        <b>Tags:</b>
                    </div>
                    <div>
                        {milestone.tags.map((tag, idx) => (
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
                        ))}
   
                    </div>
                    <div>

                        {/* Complete Milestone button (Only visible to the worker) */}
                        { milestone.workerName !== null && milestone.status === MILESTONE_STATUS.InProgress && props.walletUser.address === milestone.workerId ? (
                            <div>
                                <Button
                                    basic
                                    floated="right"
                                    color="olive"
                                    onClick={() => setShowMilestoneCompletedModal(true)}
                                >
                                Complete Milestone
                                </Button>
                                <br />
                            </div>
                        ) : null }

                        {/** Approve or Disapprove Milestone button (Only visible to the publisher) */}
                        {milestone.status === MILESTONE_STATUS.PendingApproval && props.walletUser.address === project.publisher ? (
                            <div>
                                <Button.Group floated="right">
                                    <div>
                                        <Button
                                            basic
                                            color="olive"
                                            onClick={e => {
                                                e.stopPropagation();
                                                setShowProvideRatingModal({
                                                    show:true,
                                                    onClickHandler:handleApproveMilestone,
                                                    title: "Approve milestone and Provide Rating",
                                                    label: "Provide Worker Rating"
                                                })
                                            }}
                                        >
                                            Approve
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            basic
                                            color="red"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowConfirmModal({
                                                    show:true,
                                                    onClickHandler: handleDisapproveMilestone
                                                })
                                            }}
                                        >
                                            Disapprove
                                        </Button>
                                    </div>
                                </Button.Group>
                                <br />
                            </div>
                        ) : (null)}

                        {/** Provide Customer Rating and Disapprove Rating buttons (visible to only worker ) */}
                        { project.status === 'Open' && milestone.status === MILESTONE_STATUS.CustomerRatingPending && props.walletUser.address === milestone.workerId ? (
                            <div>
                                <Button.Group floated="right">
                                    <div>
                                        <Button
                                            basic
                                            color="olive"
                                            onClick={e => {
                                                e.stopPropagation();
                                                setShowProvideRatingModal({
                                                    show:true,
                                                    onClickHandler:handleProvideCustomerRating,
                                                    title: "Provide Customer Rating",
                                                    label: "Provide Customer Rating"
                                                })
                                            }}
                                        >
                                            Provide Customer Rating
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            basic
                                            color="red"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowConfirmModal({
                                                    show:true,
                                                    onClickHandler: handleDisapproveRating
                                                })
                                            }}
                                        >
                                            Disapprove Rating
                                        </Button>
                                    </div>
                                </Button.Group>
                                <br />
                            </div>
                        ) : null}

                        {/** Close Milestone or Disapprove Rating buttons (visible only to the publisher) */}
                        { project.status === 'Open' && milestone.status === MILESTONE_STATUS.CustomerRatingProvided && props.walletUser.address === project.publisher ? (
                            <div>
                                <Button.Group floated="right">
                                    <div>
                                        <Button
                                            basic
                                            color="olive"
                                            onClick={e => {
                                                e.stopPropagation();
                                                e.preventDefault();
                                                setShowConfirmModal({
                                                    show: true,
                                                    onClickHandler: handleCloseMilestone
                                                })
                                            }}
                                        >
                                            Close Milestone
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            basic
                                            color="red"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowConfirmModal({
                                                    show:true,
                                                    onClickHandler:handleDisapproveRating
                                                })
                                            }}
                                        >
                                            Disapprove Rating
                                        </Button>
                                    </div>
                                </Button.Group>
                                <br />
                            </div>
                        ) : null}

                        {/** Show Dispute button (Visible to all ?) */}
                        { milestone.dispute ? (
                            <div>
                                <Button
                                    basic
                                    floated="right"
                                    color="purple"
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        history.push(`/court/${milestone.milestoneId}`);
                                    }}
                                >
                                    Show Court
                                </Button>
                                <br />
                            </div>
                        ) : null}
                        

                        {/* Bid for milestone button (Only visible to other accounts) */}
                        {  project.status === 'Open' && milestone.status === MILESTONE_STATUS.Open && props.walletUser.address !== project.publisher ? (
                            <div>
                                <Button 
                                    basic 
                                    color='yellow' 
                                    floated='right'
                                    onClick={e => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setShowConfirmModal({
                                            show: true,
                                            onClickHandler: onBidForMilestone
                                        });
                                    }}
                                >
                                    Bid
                                </Button>
                                <br />
                            </div>
                        ) : null }
                        <br />
                    </div>

                </Segment>
            </Accordion.Content>

            <BidderList
                show={showBidderList}
                setShow={setShowBidderList}
                bidderList={bidderList}
                handleAcceptBid={handleAcceptBid}
            />

            <ConfirmModal
                show={showConfrimModal.show}
                setShow={setShowConfirmModal}
                handleClose={() => {setShowConfirmModal({show:false, onClickHandler:null})}}
                onClickHandler={showConfrimModal.onClickHandler} 
            />

            <CompleteMilestone
                show={showMilestoneCompletedModal}
                setShow={setShowMilestoneCompletedModal} 
                milestone={milestone}
                api={api}
                {...props}
            />

            <ProvideRatingModal
                show={showProvideRatingModal.show}
                onClickHandler={showProvideRatingModal.onClickHandler}
                title={showProvideRatingModal.title}
                label={showProvideRatingModal.label}
                handleClose={() => setShowProvideRatingModal({
                    show: false,
                    onClickHandler: null,
                    title: '',
                    label: ''
                })}
            />

        </div>
    );
}

export default MilestoneDetails;