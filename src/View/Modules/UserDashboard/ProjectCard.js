import React, { useState } from "react";
import { useSelector } from "react-redux";

import MilestoneModal from "../CreateProject/MilestoneModal";
import {
  addMilestoneToProjectTx,
  addProjectToMarketplaceTx,
  closeProjectTx,
} from "../../../palletTaskingFunctions";
import { ProjectDetailCard } from "../ProjectDetails/ProjectDetailCard";

const ProjectCard = (props) => {
  const project = props.project;

  const [showModel, setShowModel] = useState({
    show: false,
    index: -1,
  });

  const callInit = () => {
    setTimeout(() => {
      props.init();
    }, 6000);
  };

  const onMilestoneCreate = async (event, milestone) => {
    event.stopPropagation();
    event.preventDefault();
    const user = props.user;
    const projectId = project.projectId;
    const api = props.api;
    setShowModel({
      show: false,
      index: -1,
    });
    callInit();
    await addMilestoneToProjectTx(api, user.address, projectId, [milestone]);
  };

  const onAddProjectToMarketplace = async () => {
    callInit();
    await addProjectToMarketplaceTx(
      props.api,
      props.user.address,
      project.projectId
    );
  };

  const onCloseProject = async () => {
    callInit();
    await closeProjectTx(props.api, props.user.address, project.projectId);
  };

  const taskTagsForForm = useSelector(
    (state) => state.authenticationReducer.userTags
  );
  const filteredTags = taskTagsForForm.map((tag) => ({
    value: tag,
    label: tag,
  }));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <ProjectDetailCard
          onAddProjectToMarketplace={onAddProjectToMarketplace}
          setShowModel={setShowModel}
          onCloseProject={onCloseProject}
          project={project}
        />
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
