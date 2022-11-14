import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
// import { Accordion, Badge, Breadcrumb, Button, Card } from 'react-bootstrap';
import { Row } from 'react-bootstrap';

import { acceptJuryDutyAndCastVoteTx, sudoJurorCastVoteTx } from '../../../palletTaskingFunctions';
import { useSubstrateState } from '../../../substrate-lib';
import PotentialJurors from './PotentialJurors';
import CourtDetails from './CourtDetails';
import FinalJurors from './FinalJurors';
import SudoJuror from './SudoJuror';
import VoteModal from './VoteModal';
import CourtSummary from './CourtSummary';
import { toast } from 'react-toastify';
import CustomBreadcrumb from '../UserDashboard/CustomBreadCrumb';

toast.configure();

const Court = ({ match }) => {

  const { api } = useSubstrateState();

  const isWalletConnected = useSelector(
    (state) => state.headerReducer.isWalletConnected
  );

  const walletUser = useSelector(state => state.headerReducer.currentWalletDetails.meta);
  walletUser.address = useSelector(state => state.headerReducer.currentWalletDetails.address);

  const projects = useSelector((state) => state.dashBoardReducer.tasks);

  const [ milestone, setMilestone ] = useState(null);
  const [ showVoteModal, setShowVoteModal ] = useState({
    show: false,
    onClickHandler: null
  })

  const getMilestone = (milestoneId) => {
    try{
      if(milestoneId === null) return;
      const projectId = milestoneId.slice(0,-1);
      const milestoneNumber = milestoneId.slice( milestoneId.length - 1, milestoneId.length ).charCodeAt(0) - 97;
      const project = projects[projectId - 1];
      const milestoneRequired = project.milestones[milestoneNumber];
      milestoneRequired.publisher = project.publisher;
      milestoneRequired.publisherName = project.publisherName;
      return milestoneRequired;
    }catch(error){
      return;
    }
  }

  const init = () => {
    const milestoneId = match.params.id;
    const tempMilestone = getMilestone(milestoneId);
    // console.log('temp milestone = ',tempMilestone);
    setMilestone(tempMilestone);
  }

  useEffect(() => {
    init();
  }, [projects])

  if(!milestone) {
    return null;
  }

  if(!milestone.dispute) {
    return null;
  }


  const handleCastVote = async (voteDetails) => {
    // console.log('account Id = ',accountId);
    const { accountId, milestoneId, votedFor, customerRating, workerRating} = voteDetails;
    await acceptJuryDutyAndCastVoteTx(api,accountId,milestoneId,votedFor,customerRating,workerRating);
  }

  const handleSudoJurorCastVote = async ({accountId, milestoneId, votedFor, customerRating, workerRating}) => {
    await sudoJurorCastVoteTx(api,accountId,milestoneId,votedFor,customerRating,workerRating);
  }


  return (
    <>
       <Row className="p-4">
            <div className="d-flex justify-content-between align-items-center">
                <h2>Dispute Details</h2>
            </div>
        </Row>
        <CustomBreadcrumb
          home={1}
          link={`/court/${milestone.milestoneId}`}
          name={"Dispute Details"} 
        />
        <CourtDetails
          milestone={milestone} 
        />
        <br />
        <PotentialJurors 
          dispute={milestone.dispute} 
          user={walletUser}
          setShowVoteModal={setShowVoteModal}
          onClickHandler={handleCastVote}
        />
        <br />
        {milestone.dispute.finalJurors && Object.keys(milestone.dispute.finalJurors).length !== 0 ? (
          <>
            <FinalJurors 
              dispute={milestone.dispute}
            />
            <br />
          </>
        ) : null }

        {milestone.dispute.sudoJuror !== null ? (
          <>
            <SudoJuror 
              dispute={milestone.dispute}
              user={walletUser}
              setShowVoteModal={setShowVoteModal}
              onClickHandler={handleSudoJurorCastVote}
            />
            <br />
          </>
        ) : null }

      <CourtSummary 
        dispute={milestone.dispute}
      />

      <VoteModal 
        milestone={milestone}
        user={walletUser}
        show={showVoteModal.show}
        setShowVoteModal={setShowVoteModal}
        onClickHandler={showVoteModal.onClickHandler}
        handleClose={() => {setShowVoteModal({show:false, onClickHandler:null})}}
      />
    </>
  );
};

export default Court;
