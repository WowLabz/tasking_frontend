import React, { useState, useEffect } from "react";
import { Row, Button, InputGroup, FormControl, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Select from "react-select";
import { useHistory } from "react-router-dom";

import { useSubstrateState } from "../../../substrate-lib";
import CardForAirDrop from "../DashBoard/CardForAirDrop";
import MilestoneCard from "./MilestoneCard";
import MilestoneModal from "./MilestoneModal";
import addImg from "./static/plus.png";
import * as palletTaskingFunctions from "../../../palletTaskingFunctions";
import ConfirmModal from "../../../Utilities/ConfirmModal";
import CustomBreadcrumb from "../UserDashboard/CustomBreadCrumb";

toast.configure();

const CreateProject = () => {
  const { api } = useSubstrateState();
  const history = useHistory();

  const [project, setProject] = useState({
    publisherName: "",
    projectName: "",
    tags: [],
    milestones: [],
  });

  // to show or hide the modal
  const [showModel, setShowModel] = useState({
    show: false,
    index: -1,
  });

  // to show or hide the confirm modal
  const [showConfirmModal, setShowConfirmModal] = useState({
    show: false,
    onClickHandler: null,
  });

  const [valid, setValid] = useState(false);

  const walletUser = useSelector(
    (state) => state.headerReducer.currentWalletDetails.meta
  );
  walletUser.address = useSelector(
    (state) => state.headerReducer.currentWalletDetails.address
  );

  useEffect(() => {
    const tempProject = { ...project };
    tempProject.publisherName = walletUser.name;
    setProject(tempProject);
  }, [walletUser]);

  useEffect(() => {
    if (
      project.name !== "" &&
      project.tags.length !== 0 &&
      project.milestones.length !== 0
    ) {
      setValid(true);
    }
  }, [project]);

  const onValueChange = (event, value) => {
    const tempProject = { ...project };
    tempProject[value] = event.target.value;
    setProject(tempProject);
  };

  // for UI
  const taskTagsForForm = useSelector(
    (state) => state.authenticationReducer.userTags
  );

  const filteredTags = taskTagsForForm.map((tag) => ({
    value: tag,
    label: tag,
  }));

  const onTagChange = (event) => {
    const tags = event.map((obj) => obj.value);
    const tempProject = { ...project };
    tempProject.tags = tags;
    setProject(tempProject);
  };

  const handleCreateProject = async () => {
    setTimeout(() => {
      history.push("/user");
    }, 3000);
    return await palletTaskingFunctions.createProjectTx(
      api,
      walletUser.address,
      project
    );
  };

  const onMilestoneCreate = (
    event,
    milestone,
    validateForm,
    setErrors,
    index
  ) => {
    event.preventDefault();
    const tempErrors = validateForm();
    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
    } else {
      if (index === -1) {
        const tempProject = { ...project };
        tempProject.milestones.push(milestone);
        setProject(tempProject);
      } else {
        const tempProject = { ...project };
        tempProject.milestones[index] = milestone;
        setProject(tempProject);
      }
      setShowModel({
        show: false,
        index: -1,
      });
    }
  };

  const onMilestoneDelete = (index) => {
    const tempProject = { ...project };
    const milestoneLength = tempProject.milestones.length;
    for (let i = index; i < milestoneLength - 1; i++) {
      tempProject.milestones[i] = tempProject.milestones[i + 1];
    }
    tempProject.milestones.pop();
    setProject(tempProject);
    setShowModel({
      show: false,
      index: -1,
    });
  };

  return (
    <>
      <Row className="p-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2>Create a new Project</h2>
        </div>
        <CardForAirDrop />
      </Row>
      <CustomBreadcrumb
        home={1}
        link={"/create-project"}
        name={"Create Project"}
      />

      <Form.Label>Publisher Name</Form.Label>
      <InputGroup className="mb-3">
        <FormControl value={project.publisherName} disabled />
      </InputGroup>

      <Form.Label>Account ID</Form.Label>
      <InputGroup className="mb-3">
        <FormControl value={walletUser.address} disabled />
      </InputGroup>

      <Form.Label>Project Name</Form.Label>
      <InputGroup className="mb-3">
        <FormControl
          required
          type="text"
          placeholder="Project Name"
          onChange={(event) => onValueChange(event, "projectName")}
          value={project.projectName}
        />
      </InputGroup>

      <Form.Label>Project Tags</Form.Label>
      <Select
        options={filteredTags}
        isMulti
        onChange={onTagChange}
        placeholder="Select Tags"
      ></Select>

      <br />

      <Row>
        <div className="d-flex align-items-center">
          {project.milestones.length > 0 &&
            project.milestones.map((milestone, index) => {
              return (
                <MilestoneCard
                  milestone={milestone}
                  key={index}
                  project={project}
                  setProject={setProject}
                  index={index}
                  setShowModel={setShowModel}
                />
              );
            })}
          {project.milestones.length < 5 && (
            <div className="d-flex flex-column justify-content-between align-items-center">
              <img
                src={addImg}
                onClick={() => setShowModel({ show: true, index: -1 })}
                style={{ width: "50px", height: "50px" }}
              />
              <h5 style={{ padding: 0, margin: 0 }}>Add a milestone</h5>
            </div>
          )}
        </div>
      </Row>

      <Row className="p-4">
        <Button
          variant="dark"
          disabled={!valid}
          // onClick={handleCreateProject}
          onClick={(e) =>
            setShowConfirmModal({
              show: true,
              onClickHandler: handleCreateProject,
            })
          }
        >
          Create Project
        </Button>
      </Row>
      <MilestoneModal
        showModel={showModel}
        setShowModel={setShowModel}
        filteredTags={filteredTags}
        project={project}
        setProject={setProject}
        onMilestoneCreate={onMilestoneCreate}
        onMilestoneDelete={onMilestoneDelete}
      />
      <ConfirmModal
        onClickHandler={showConfirmModal.onClickHandler}
        show={showConfirmModal.show}
        handleClose={() => {
          setShowConfirmModal({
            show: false,
            onClickHandler: null,
          });
        }}
      />
    </>
  );
};

export default CreateProject;
