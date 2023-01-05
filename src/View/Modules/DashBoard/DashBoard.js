import React, { useEffect, useState } from "react";
import { Row, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import "./Dashboard.css";
import TaskCard from "./TaskCard"; // this
import * as constants from "./constants";
import "react-toastify/dist/ReactToastify.min.css";
import CardForAirDrop from "./CardForAirDrop";
import { Empty } from "antd";
import AdvanceSearch from "./AdvanceSearch";

toast.configure();

const DashBoard = (props) => {
  const history = useHistory();
  const [milestones, setMilestones] = useState([]);
  const [searchActive, setSearchActive] = useState(false);

  const filterProjects = (projects) => {
    const milestoneList = [];
    if (!projects) return milestoneList;
    for (let index = projects.length - 1; index >= 0; index--) {
      const project = projects[index];

      if (project.status === "Open") {
        project.milestones.map((milestone) => {
          milestone.publisherName = project.publisherName;
          milestoneList.push(milestone);
        });
      }
    }
    return milestoneList;
  };

  // initial render
  const tasks = useSelector((state) => state.dashBoardReducer.tasks);
  useEffect(() => {
    console.log("The tasks are = ", tasks);
    const tmpMilestones = filterProjects(tasks);
    setMilestones(tmpMilestones);
  }, []);

  // re-render each time if tasks changes
  useEffect(() => {
    console.log("tasks has changed = ", tasks);
    const tmpMilestones = filterProjects(tasks);
    if (tmpMilestones && tmpMilestones.length !== 0 && !searchActive) {
      setMilestones(tmpMilestones);
    }
  }, [tasks]);

  const currentUserTags = useSelector(
    (state) => state.authenticationReducer.currentUserName.user_tags
  );
  const sortByOption = useSelector((state) => state.dashBoardReducer.sortBy);
  const isWalletConnected = useSelector(
    (state) => state.headerReducer.isWalletConnected
  );

  const [show, setShow] = useState(false);
  const [currentFormTypeAndData, setCurrentFormTypeAndData] = useState({
    formType: constants.FORM_TYPES.CREATE_TASK,
    data: "",
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const showFormModal = (e, data) => {
    const formTypeOnClick = e.target.innerText;

    const title =
      formTypeOnClick === `Create New Task`
        ? constants.FORM_TYPES.CREATE_TASK.title
        : formTypeOnClick === `Bid`
        ? constants.FORM_TYPES.BID_FOR_TASK.title
        : formTypeOnClick === `Complete`
        ? constants.FORM_TYPES.COMPLETE_TASK.title
        : formTypeOnClick === `Approve`
        ? constants.FORM_TYPES.APPROVE_TASK.title
        : formTypeOnClick === "Provide Customer Ratings"
        ? constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.title
        : formTypeOnClick === `Close`
        ? constants.FORM_TYPES.CLOSE_TASK.title
        : formTypeOnClick === `Raise Dispute`
        ? constants.FORM_TYPES.RAISE_DISPUTE.title
        : formTypeOnClick === `Disapprove`
        ? constants.FORM_TYPES.DISAPPROVE_TASK.title
        : formTypeOnClick === `Disapprove Worker Ratings`
        ? constants.FORM_TYPES.DISAPPROVE_WORKER_RATINGS.title
        : formTypeOnClick === `Disapprove Customer Ratings`
        ? constants.FORM_TYPES.DISAPPROVE_CUSTOMER_RATINGS.title
        : "Form";

    setCurrentFormTypeAndData({
      formType: { type: formTypeOnClick, title },
      data: data,
    });
    handleShow();
  };

  return (
    <>
      <Row className="p-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2 style={{ margin: "0" }}>Marketplace</h2>

          <Button
            onClick={(e) => {
              if (!isWalletConnected) {
                toast.error(`Connect crypto wallet`, {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000,
                });
              } else {
                history.push("/user");
              }
            }}
          >
            User Dashboard
          </Button>
        </div>
        <CardForAirDrop />
      </Row>
      <AdvanceSearch
        setMilestones={setMilestones}
        setSearchActive={setSearchActive}
      />
      <br />
      <Row>
        {!tasks.length && (
          // <span style={{ marginLeft: "45px" }} className="p-2">
          //     Showing Demo Data, You can create a new Task!
          // </span>
          <Empty description={<span>Create new tasks</span>} />
        )}
        {/* {tasks.length > 0 &&
          tasks.map((task, index) => (
            <TaskCard data={task} showFormModal={showFormModal} key={index} />
          ))} */}
        {milestones.length > 0 &&
          milestones.map((task, index) => (
            <TaskCard data={task} showFormModal={showFormModal} key={index} />
          ))}
      </Row>
    </>
  );
};

export default DashBoard;
