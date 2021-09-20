import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Breadcrumb, Button, Card } from "react-bootstrap";
import { TabDetails, TAB_TYPE, TASK_STATUS } from "./constants";
import "./TaskDetails.css";
import TaskDescriptionCard from "./TaskDescriptionCard";
import CreateTaskCard from "./CreateTaskCard";
import BidForTaskCard from "./BidForTaskCard";
import CompleteTaskCard from "./CompleteTaskCard";
import ApproveTaskCard from "./ApproveTaskCard";
import RatingsForTaskTask from "./RatingsForTaskCard";
import { LinkContainer } from "react-router-bootstrap";

const TaskDetails = ({ match }) => {
    const [tabs, setTabs] = useState([]);
    const [breadCrumbsArr, setBreadCrumbArr] = useState([]);
    const tasks = useSelector((state) => state.dashBoardReducer.tasks);

    const init = () => {
        const taskId = match.params.id;

        let tempTabs;
        tasks.forEach((task) => {
            if (task.task_id === taskId) {
                setBreadCrumbArr([
                    {
                        link: "/",
                        active: false,
                        name: "Dashboard",
                    },
                    {
                        link: `/taskdetails/${task.task_id}`,
                        active: true,
                        name: task?.task_description,
                    },
                ]);

                switch (task.status) {
                    case TASK_STATUS.Open:
                        tempTabs = [
                            {
                                tabId: 1,
                                tabType: TAB_TYPE.TASK_DETAILS,
                                task,
                            },
                            {
                                tabId: 2,
                                tabType: TAB_TYPE.CREATE_TASK,
                                task,
                            },
                        ];
                        break;
                    case TASK_STATUS.InProgress:
                        tempTabs = [
                            {
                                tabId: 1,
                                tabType: TAB_TYPE.TASK_DETAILS,
                                task,
                            },
                            {
                                tabId: 2,
                                tabType: TAB_TYPE.CREATE_TASK,
                                task,
                            },
                            {
                                tabId: 3,
                                tabType: TAB_TYPE.BID_TASK,
                                task,
                            },
                        ];
                        break;
                    case TASK_STATUS.PendingApproval:
                        tempTabs = [
                            {
                                tabId: 1,
                                tabType: TAB_TYPE.TASK_DETAILS,
                                task,
                            },
                            {
                                tabId: 2,
                                tabType: TAB_TYPE.CREATE_TASK,
                                task,
                            },
                            {
                                tabId: 3,
                                tabType: TAB_TYPE.BID_TASK,
                                task,
                            },
                            {
                                tabId: 4,
                                tabType: TAB_TYPE.COMPLETE_TASK,
                                task,
                            },
                        ];
                        break;
                    case TASK_STATUS.PendingRatings:
                        tempTabs = [
                            {
                                tabId: 1,
                                tabType: TAB_TYPE.TASK_DETAILS,
                                task,
                            },
                            {
                                tabId: 2,
                                tabType: TAB_TYPE.CREATE_TASK,
                                task,
                            },
                            {
                                tabId: 3,
                                tabType: TAB_TYPE.BID_TASK,
                                task,
                            },
                            {
                                tabId: 4,
                                tabType: TAB_TYPE.COMPLETE_TASK,
                                task,
                            },
                            {
                                tabId: 5,
                                tabType: TAB_TYPE.APPROVE_TASK,
                                task,
                            },
                        ];
                        break;
                    case TASK_STATUS.Completed:
                        tempTabs = [
                            {
                                tabId: 1,
                                tabType: TAB_TYPE.TASK_DETAILS,
                                task,
                            },
                            {
                                tabId: 2,
                                tabType: TAB_TYPE.CREATE_TASK,
                                task,
                            },
                            {
                                tabId: 3,
                                tabType: TAB_TYPE.BID_TASK,
                                task,
                            },
                            {
                                tabId: 4,
                                tabType: TAB_TYPE.COMPLETE_TASK,
                                task,
                            },
                            {
                                tabId: 5,
                                tabType: TAB_TYPE.APPROVE_TASK,
                                task,
                            },
                            {
                                tabId: 6,
                                tabType: TAB_TYPE.RATINGS_FOR_TASK,
                                task,
                            },
                        ];
                        break;
                    default:
                        tempTabs = [
                            {
                                tabId: 1,
                                tabType: TAB_TYPE.TASK_DETAILS,
                                task,
                            },
                            {
                                tabId: 2,
                                tabType: TAB_TYPE.CREATE_TASK,
                                task,
                            },
                        ];
                        break;
                }
                setTabs(tempTabs);
            }
        });
    };

    useEffect(() => {
        init();
        return () => {};
    }, []);

    const getCard = (currTab) => {
        switch (currTab.tabType) {
            case TAB_TYPE.TASK_DETAILS:
                return <TaskDescriptionCard tab={currTab} />;
            case TAB_TYPE.CREATE_TASK:
                return <CreateTaskCard tab={currTab} />;
            case TAB_TYPE.BID_TASK:
                return <BidForTaskCard tab={currTab} />;
            case TAB_TYPE.COMPLETE_TASK:
                return <CompleteTaskCard tab={currTab} />;
            case TAB_TYPE.APPROVE_TASK:
                return <ApproveTaskCard tab={currTab} />;
            case TAB_TYPE.RATINGS_FOR_TASK:
                return <RatingsForTaskTask tab={currTab} />;
            default:
                return;
        }
    };

    return (
        <div className="task-details-container">
            <Breadcrumb>
                {breadCrumbsArr.map((item) => (
                    <LinkContainer to={item.link}>
                        <Breadcrumb.Item active={item.active}>
                            {item.name}
                        </Breadcrumb.Item>
                    </LinkContainer>
                ))}
            </Breadcrumb>
            {tabs.map((tab) => (
                <Accordion
                    key={tab.tabId}
                    defaultActiveKey={tab.tabId}
                    className="p-1 m-1"
                >
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey={tab.tabId} className="accordion-header">
                            {tab.tabType}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey={tab.tabId}>
                            {getCard(tab)}
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            ))}
        </div>
    );
};

export default TaskDetails;
