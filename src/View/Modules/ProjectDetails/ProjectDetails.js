import React, { useState, useEffect } from 'react';
import { Row, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import {  Segment, Accordion, Icon, Header, List, Grid, Button} from 'semantic-ui-react'

import MilestoneModal from '../CreateProject/MilestoneModal';
import { getAttributesForCard } from './ProjectDetailCard';
import { useSubstrateState } from '../../../substrate-lib';
import { addMilestoneToProjectTx, addProjectToMarketplaceTx, getAllProjects, closeProjectTx, bidForMilestoneTx  } from '../../../palletTaskingFunctions';
import * as dashboardActionCreators from '../DashBoard/actionCreators';


const ProjectDetails = (props) => {
    
    const projectId = props.match.params.id;
    const projects = useSelector((state) => state.dashBoardReducer.tasks);
    const { api } = useSubstrateState();
    const dispatch = useDispatch();

    const walletUser = useSelector(state => state.headerReducer.currentWalletDetails.meta);
    walletUser.address = useSelector(state => state.headerReducer.currentWalletDetails.address);
    

    const taskTagsForForm = useSelector(
        (state) => state.authenticationReducer.userTags
    );

    const [ userProject, setUserProject ] = useState(null);
    const [ activeIndex, setActiveIndex ] = useState(0);
    // for milestone modal
    const [showModel, setShowModel] = useState({
        show: false,
        index: -1
    });


    const init = async () => {
        try {
            const getProjectResult = await getAllProjects(api);
            if (getProjectResult) {
                dispatch(dashboardActionCreators.setTasksFromBackEnd(getProjectResult));
            }
        }catch(error) {
            console.log(`catchError at useEffect : ${error.stack}`);
        }
    };

    useEffect(() => {
        const initialize = async () => {
            await init();
        }
        initialize();
        const tempProject = projects.filter(project => project.projectId === projectId);
        if(tempProject.length !== 0)
            setUserProject(tempProject[0]);
    }, []);

    useEffect(() => {
        const tempProject = projects.filter(project => project.projectId === projectId);
        if(tempProject.length !== 0)
            setUserProject(tempProject[0]);
    }, [projects])

    if(!userProject) {
        return (
            <div>
                <Row className="p-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2>Project Details</h2>
                    </div>
                </Row>
                <Segment placeholder>
                    <Header icon>
                        <Icon name='close' />
                        The project does not exist.
                    </Header>
                </Segment>
            </div>
        );
    }

    const onAddProjectToMarketplace = async (event) => {
        event.preventDefault();
        setTimeout(()=> {
            init();
        }, 6000);
        await addProjectToMarketplaceTx(api,walletUser.address,projectId);
    }

    const onCloseProject = async (event) => {
        event.preventDefault();
        setTimeout(() => {
            init();
        },6000);
        await closeProjectTx(api,walletUser.address,projectId);
    }

    const onMilestoneCreate = async (event,milestone) => {
        event.preventDefault();
        setShowModel({
            show: false,
            index: -1
        });
        setTimeout(()=> {
            init();
        }, 6000);
        await addMilestoneToProjectTx(api,walletUser.address,projectId,[milestone])
    };

    const onBidForMilestone = async (milestoneId) => {
        await bidForMilestoneTx(api,walletUser.address,milestoneId,walletUser.name);
    }

    const tempProps = {
        setShowModel,
        onAddProjectToMarketplace,
        onCloseProject
    }
    
    const attributes = getAttributesForCard(userProject,tempProps);

    const handleAccordionClick = (event, titleProps) => {
        const { index } = titleProps;
        const newIndex = activeIndex === index ? -1 : index;
        setActiveIndex(newIndex);
    }

    // for UI 
    

    const filteredTags = taskTagsForForm.map(tag => ({value:tag, label:tag}));

    return (
        <>
            <Row className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                    <h2>Project Details</h2>
                </div>
            </Row>
            <Accordion fluid styled>
                <Accordion.Title
                    active={activeIndex===0}
                    index={0}
                    onClick={handleAccordionClick}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <Icon name='dropdown' />
                        {userProject.projectName}
                        <div>
                            <Badge
                                variant={attributes.badgeColor}
                                className="px-2 mx-2"
                                style={{
                                    display: 'table',
                                    color: `${
                                    attributes.badgeColor === 'yellow' ? 'black' : 'white'
                                    }`,
                                    backgroundColor: `${attributes.badgeColor}`,
                                    borderRadius: '10px',
                                    padding: '0.4rem',
                                }}
                            >
                                {userProject.status}
                            </Badge>
                        </div>
                    </div>
                </Accordion.Title>
                <Accordion.Content
                    active={activeIndex===0}
                >
                    <Segment>
                        <Header>
                            {userProject.projectName}
                        </Header>
                        <List bulleted>
                            <List.Item>
                                Project Id: {userProject.projectId}
                            </List.Item>
                            <List.Item>
                                Publisher Name : {userProject.publisherName}
                            </List.Item>
                            <List.Item>
                                Publisher Address: {userProject.publisher}
                            </List.Item>
                            <List.Item>
                                Overall Customer Rating: {userProject.overallCustomerRating === null ? 'N/A' : userProject.overallCustomerRating}
                            </List.Item>
                        </List>
                        <div>
                            <b>Tags:</b>
                        </div>
                        <div>
                            {userProject.tags.map((tag, idx) => (
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
                    </Segment>
                </Accordion.Content>

                {
                    userProject.milestones.map((milestone, index ) => {
                        return(
                            <div key={index}>
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
                                        <Header>
                                            {milestone.milestoneName}
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
                                                Publisher Attachment Link: <a href={milestone.publisherAttachments[0]} target="_blank">IPFS Link</a>
                                            </List.Item>
                                            { milestone.workerId !== null ? (
                                                <List.Item>
                                                    Worker Id: {milestone.workerId}
                                                </List.Item>
                                            ) : null }
                                            { milestone.workerName !== null ? (
                                                <List.Item>
                                                    Worker Id: {milestone.workerName}
                                                </List.Item>
                                            ) : null }
                                            { milestone.workerAttachments !== null ? (
                                                <List.Item>
                                                    Worker Id: {milestone.workerAttachments}
                                                </List.Item>
                                            ) : null }
                                            { milestone.finalWorkerRating !== null ? (
                                                <List.Item>
                                                    Worker Id: {milestone.finalWorkerRating}
                                                </List.Item>
                                            ) : null }
                                            { milestone.finalCustomerRating !== null ? (
                                                <List.Item>
                                                    Worker Id: {milestone.finalCustomerRating}
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
                                        { userProject.status === 'Open' && milestone.status === 'Open' ? (
                                            <div>
                                                <Button 
                                                    basic 
                                                    color='yellow' 
                                                    floated='right'
                                                    onClick={e => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        onBidForMilestone(milestone.milestoneId)
                                                    }}
                                                >
                                                    Bid
                                                </Button>
                                                <br />
                                            </div>
                                        ) : null }
                                        <br />
                                    </Segment>
                                </Accordion.Content>
                            </div>
                        );
                    })
                }
            </Accordion>
            <br />
            {/* {attributes.button} */}
            <Grid divided="vertically">
                <Grid.Row columns={attributes.button.length > 0 ? attributes.button.length : "equal"}>
                    {
                        attributes.button.map((Button,idx) => {
                            return (
                                <Grid.Column key={idx}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        {Button}
                                    </div>
                                </Grid.Column>
                            )
                        })
                    }
                </Grid.Row>
            </Grid>
            <MilestoneModal
                showModel={showModel}
                setShowModel={setShowModel}
                filteredTags={filteredTags}
                project={userProject}
                onMilestoneCreate={onMilestoneCreate} 
            />
        </>
    );
};

export default ProjectDetails;