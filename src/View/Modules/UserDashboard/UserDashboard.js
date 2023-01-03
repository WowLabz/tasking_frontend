import React, { useState, useEffect } from 'react';
import {  Row, Button, CardGroup } from 'react-bootstrap';
import { Segment, Container, Icon, Header } from 'semantic-ui-react';
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from 'react-router-dom';

import * as palletTaskingFunctions from '../../../palletTaskingFunctions';
import * as dashboardActionCreators from '../DashBoard/actionCreators';
import { useSubstrateState } from "../../../substrate-lib";
import CardForAirDrop from "../DashBoard/CardForAirDrop";
import ProjectCard from './ProjectCard';
import CustomBreadcrumb from "./CustomBreadCrumb";

toast.configure();


const UserDashboard = () => {

    const { api } = useSubstrateState();
    const history = useHistory();
    const dispatch = useDispatch();

    const isWalletConnected = useSelector(
        (state) => state.headerReducer.isWalletConnected
    );
    
    const walletUser = useSelector(state => state.headerReducer.currentWalletDetails.meta);
    walletUser.address = useSelector(state => state.headerReducer.currentWalletDetails.address);
    
    let projects = useSelector((state) => state.dashBoardReducer.tasks);

    const [userProjects, setUserProjects] = useState([]);

    const init = async () => {
        try {
            const getProjectResult = await palletTaskingFunctions.getAllProjects(api);
            if (getProjectResult) {
                dispatch(dashboardActionCreators.setTasksFromBackEnd(getProjectResult));
            }
        }catch(error) {
            console.log(`catchError at useEffect : ${error.stack}`);
        }
    };

    // Initial render
    useEffect(() => {
        const initialize = async () => {
            await init();
        };
        initialize();
        
    }, [])

    // Everytime project or wallet user changes
    useEffect(() => {
        const tempUserProjects = projects.filter(project => project.publisher === walletUser.address);

        setUserProjects(tempUserProjects);

    },[projects, walletUser]);

    if(userProjects.length === 0) {
        return (
            <div>
                 <Row className="p-4">
                    <div className="d-flex justify-content-between align-items-center">
                    <h2 style={{ margin: '0' }}>User Dashboard</h2>
                    <Button
                        onClick={(e) => {
                        if(!isWalletConnected) {
                            toast.error(`Connect crypto wallet`, {
                            position: toast.POSITION.TOP_RIGHT,
                            autoClose: 2000,
                            });
                        } else {
                            history.push('/create-project');
                        }
                        }}
                    >
                        Create New Project
                    </Button>
                    </div>
                    <CardForAirDrop />
                </Row>
                <Container>
                    <Segment placeholder onClick={(e) => {
                        if(!isWalletConnected) {
                            toast.error(`Connect crypto wallet`, {
                                position: toast.POSITION.TOP_RIGHT,
                                autoClose:2000,
                            });
                        }else{
                            history.push('/create-project');
                        }
                        
                    }} style={{'cursor': 'pointer'}}>
                        <Header icon>
                            <Icon name='add' />
                            You do not have any projects. Click to create a new project.
                        </Header>
                    </Segment>
                </Container>
            </div>
        );
    }

    return (
        <>
            <Row className="p-4">
                <div className="d-flex justify-content-between align-items-center">
                <h2 style={{ margin: '0' }}>User Dashboard</h2>
                <Button
                    onClick={(e) => {
                    if(!isWalletConnected) {
                        toast.error(`Connect crypto wallet`, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                        });
                    } else {
                        history.push('/create-project');
                    }
                    }}
                >
                    Create New Project
                </Button>
                </div>
                <CardForAirDrop />
            </Row>
            <CustomBreadcrumb
                home={0}
                link={'/user'}
                name={"User Dashboard"} 
            />
            <Row>
                {/* <div className='d-flex align-items-center'> */}
                <CardGroup>
                    {
                        userProjects.length !== 0 && (
                            userProjects.map((project, idx) => {
                                return(
                                    <div key={idx}>
                                        <ProjectCard 
                                            project = {project} 
                                            user={walletUser} 
                                            api = {api} 
                                            init = {init}
                                            key={idx}
                                        />
                                    </div>
                                );
                            })
                        )
                    }
                </CardGroup>
                {/* </div> */}
            </Row>
        </>
    );
};

export default UserDashboard;