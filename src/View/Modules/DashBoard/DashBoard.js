import React, { useEffect, useState } from "react";
import { Row, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import "./Dashboard.css";
import TaskCard from "./TaskCard"; // this
import "react-toastify/dist/ReactToastify.min.css";
import CardForAirDrop from "./CardForAirDrop";
import { Empty } from "antd";

toast.configure();

const DashBoard = (props) => {
  const history = useHistory();
  const [milestones, setMilestones] = useState([]);

  const filterProjects = (projects) => {
    const milestoneList = [];
    if (!projects) return milestoneList;
    for (let index = projects.length - 1; index >= 0; index--) {
      const project = projects[index];

      if (project.status === "Open") {
        project.milestones.map((milestone) => {
          milestone.publisherName = project.publisherName;
          milestoneList.push(milestone);
          return null;
        });
      }
    }
    return milestoneList;
  };

  // initial render
  const tasks = useSelector((state) => state.dashBoardReducer.tasks);
  useEffect(() => {
    const tmpMilestones = filterProjects(tasks);
    setMilestones(tmpMilestones);
  }, [tasks]);

  // re-render each time if tasks changes
  useEffect(() => {
    const tmpMilestones = filterProjects(tasks);
    if (tmpMilestones && tmpMilestones.length !== 0) {
      setMilestones(tmpMilestones);
    }
  }, [tasks]);

  const isWalletConnected = useSelector(
    (state) => state.headerReducer.isWalletConnected
  );

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
            <TaskCard
              data={task}
              key={index}
              isWalletConnected={isWalletConnected}
              toast={toast}
            />
          ))}
      </Row>
    </>
  );
};

export default DashBoard;
