import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Accordion, Button, Card } from "react-bootstrap";
import { TabDetails, TAB_TYPE } from "./constants";
import "./TaskDetails.css";
import TaskDescriptionCard from "./TaskDescriptionCard";
import CreateTaskCard from "./CreateTaskCard";
import BidForTaskCard from "./BidForTaskCard";
import CompleteTaskCard from "./CompleteTaskCard";
import ApproveTaskCard from "./ApproveTaskCard";
import RatingsForTaskTask from "./RatingsForTaskCard";

const TaskDetails = ({ match }) => {
    const [tabs, setTabs] = useState([]);
    const tasks = useSelector((state) => state.dashBoardReducer.tasks);

    const init = () => {
        const taskId = match.params.id;

        tasks.forEach((task) => {
            if (task.task_id === taskId) {

                const {
                    client,
                    cost,
                    status,
                    task_deadline,
                    task_description,
                    task_id,
                    worker_id,
                } = task;

                setTabs([
                    {
                        tabId: 1,
                        tabType: TAB_TYPE.TASK_DETAILS,
                        label: task_description,
                        description: task_description,
                        taskDeadline: task_deadline,
                    },
                    {
                        tabId: 2,
                        tabType: TAB_TYPE.CREATE_TASK,
                        label: "Create Task",
                        description: task_description,
                        escrow: cost,
                        status: status,
                        accountId: client,
                    },
                    {
                        tabId: 3,
                        tabType: TAB_TYPE.BID_TASK,
                        label: "Bid For Task",
                        description: task_description,
                        escrow: cost,
                        status: status,
                        accountId: worker_id,
                    },
                    {
                        tabId: 4,
                        tabType: TAB_TYPE.COMPLETE_TASK,
                        description: task_description,
                        label: "Complete Task",
                        escrow: cost + cost,
                        status: status,
                    },
                    {
                        tabId: 5,
                        tabType: TAB_TYPE.APPROVE_TASK,
                        description: task_description,
                        label: "Approve Task",
                        escrow: cost + cost,
                        status: status,
                    },
                    {
                        tabId: 6,
                        tabType: TAB_TYPE.RATINGS_FOR_TASK,
                        description: task_description,
                        label: "Ratings for Task",
                        status: status,
                    },
                ]);
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
                return (<TaskDescriptionCard tab={currTab}/>);
            case TAB_TYPE.CREATE_TASK:
                return (<CreateTaskCard tab={currTab}/>)
            case TAB_TYPE.BID_TASK:
                return (<BidForTaskCard tab={currTab}/>)
            case TAB_TYPE.COMPLETE_TASK:
                return (<CompleteTaskCard tab={currTab}/>);
            case TAB_TYPE.APPROVE_TASK:
                return (<ApproveTaskCard tab={currTab}/>)
            case TAB_TYPE.RATINGS_FOR_TASK:
                return (<RatingsForTaskTask tab={currTab}/>)
            default:
                return;
        }
    }

    return (
        <div className="task-details-container">
            {tabs.map((tab) => (
                <Accordion
                    key={tab.tabId}
                    defaultActiveKey={tab.tabId}
                    className="p-1 m-1"
                >
                    <Card>
                        <Accordion.Toggle as={Card.Header} eventKey={tab.tabId}>
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
