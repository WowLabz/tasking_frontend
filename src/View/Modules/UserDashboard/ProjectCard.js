import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Badge, Card, Button, Col, NavLink } from 'react-bootstrap';

import MilestoneModal from "../CreateProject/MilestoneModal";
import { addMilestoneToProjectTx, addProjectToMarketplaceTx, closeProjectTx } from "../../../palletTaskingFunctions";

const ProjectCard = (props) => {

    
    const project = props.project;

    const [showModel, setShowModel] = useState({
        show: false,
        index: -1
    });

    const callInit = () => {
        setTimeout(() => {
            props.init();
        }, 6000);
    };

    const onMilestoneCreate = async (event,milestone) => {
        event.preventDefault();
        const user = props.user;
        const projectId = project.projectId;
        const api = props.api;
        setShowModel({
            show: false,
            index: -1
        });
        callInit();
        await addMilestoneToProjectTx(api,user.address,projectId,[milestone]);
    };

    const onAddProjectToMarketplace = async (event) => {
        event.preventDefault();
        callInit();
        await addProjectToMarketplaceTx(props.api,props.user.address, project.projectId);
    };

    const onCloseProject = async (event) => {
        event.preventDefault();
        callInit();
        await closeProjectTx(props.api, props.user.address, project.projectId );
    };

    const getAttributesForCard = (project) => {
        const attribute = {};

        const addMilestoneButton = (
            <Button
                onClick={ (e) => setShowModel({show: true, index: -1}) }
            >
                Add Milestone
            </Button>
            );
        
        const addToMarketplaceButton = (
            <Button
                onClick={ (e) => onAddProjectToMarketplace(e) }
            >
                Add to marketplace
            </Button>
            );

        const closeProjectButton = (
            <Button
                variant="danger"
                onClick={ (e) => onCloseProject(e) }
            >
                Close Project
            </Button>
        );
        attribute.button = [];
        switch (project.status) {
            case 'Ready':
                attribute.badgeColor = 'yellow';
                attribute.button.push(
                    addToMarketplaceButton
                );
                if(project.milestones.length < 5) {
                    attribute.button.push(
                        addMilestoneButton
                    );
                }
                break;
            case 'Open':
                attribute.badgeColor = 'green';
                attribute.button.push(closeProjectButton);
                break;
            case 'Closed':
                attribute.badgeColor = 'grey';
                break;
        }
        return attribute;
    }
    const attributes = getAttributesForCard(project);

    const taskTagsForForm = useSelector(
        (state) => state.authenticationReducer.userTags
    );
    const filteredTags = taskTagsForForm.map(tag => ({value:tag, label:tag}));

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center">
                <Card 
                    className="text-left p-1 d-flex justify-content-between" 
                    style={{width: '300px', height: '400px' }}
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
                                        display: 'table',
                                        color: `${
                                        attributes.badgeColor === 'yellow' ? 'black' : 'white'
                                        }`,
                                        backgroundColor: `${attributes.badgeColor}`,
                                        borderRadius: '10px',
                                        padding: '0.4rem',
                                    }}
                                >
                                    {project.status}
                                </Badge>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
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
                        <br />
                        <Card.Text>
                            <b>Number of milestones:</b> {project.milestones.length}
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className="card-footer">
                        <div className="d-flex justify-content-between align-items-center">
                            {attributes.button}
                        </div>
                    </Card.Footer>
                </Card>
            </div>
            <MilestoneModal
                showModel={showModel}
                setShowModel={setShowModel}
                filteredTags={filteredTags}
                project={project}
                onMilestoneCreate={onMilestoneCreate} 
            />
        </div>
    );
};

export default ProjectCard;