import React from "react";
import {
    Card,
    Badge,
    
} from 'react-bootstrap';

const MilestoneCard = (props) => {
    const milestone = props.milestone;
    const setShowModel = props.setShowModel;
    const index = props.index;
    return (
        <>
            <div className="d-flex justify-content-between align-items-center"
                onClick={() => setShowModel({show: true, index: index})}
                style={{marginRight: '10px'}}
            >
                <Card className="text-left p-1" 
                    style={{width: '220px', height: '350px' }}
                >
                    <Card.Header>
                        <div className="justify-content-between align-items-center">
                            <h3>{`Milestone ${index + 1}`}</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center my-1">
                            <div>
                            <div>
                                <b>Milestone Name</b>
                            </div>
                            <small style={{ fontSize: '13px' }}>
                                {milestone.name}
                            </small>
                            </div>
                        </div>
                        <Card.Text>
                            <b>Milestone Cost:</b> {milestone.cost}
                        </Card.Text>
                        <Card.Text>
                            <b>Milestone Deadline:</b> {milestone.deadline} days
                        </Card.Text>
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
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

export default MilestoneCard;