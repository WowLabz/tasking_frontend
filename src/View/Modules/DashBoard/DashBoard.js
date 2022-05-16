import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Modal, Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';

import { useSubstrateState } from '../../../substrate-lib';
import TestingSubstrateLib from '../../../TestingSubstrateLib';
import * as palletTaskingFunctions from '../../../palletTaskingFunctions'; // this
import * as actionCreators from './actionCreators';
import './Dashboard.css';
import TaskCard from './TaskCard'; // this
import TaskFormFormik from './TaskFormFormik'; // this
import * as constants from './constants';
import staticData from '../../../assets/staticData/staticData.json';
import 'react-toastify/dist/ReactToastify.min.css';
import CardForAirDrop from './CardForAirDrop';
import { Empty } from 'antd';
import { sortTasksByUserTags } from './helpers';

toast.configure();

const DashBoard = (props) => {
  const { api, keyring } = useSubstrateState();
  const dispatch = useDispatch();
  const history = useHistory();

  const tasks = useSelector((state) => state.dashBoardReducer.tasks);

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
    data: '',
  });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    const init = async () => {
      try {
        // palletTaskingFunctions.handleOnChainEvents(api, toast);
        const getTasksResult = await palletTaskingFunctions.getAllTasks(api); // async function 

        if (getTasksResult) {
          console.log(`All Tasks From Chain: ${getTasksResult.length}`);
          console.log(getTasksResult);

          let sortedArr = [];
          console.log(sortByOption);
          switch (sortByOption) {
            case constants.SORT_BY.userTags:
              sortedArr = sortTasksByUserTags(currentUserTags, getTasksResult);
              break;
            case constants.SORT_BY.statusOpen:
            case constants.SORT_BY.statusInProgress:
            case constants.SORT_BY.statusPendingApproval:
            case constants.SORT_BY.statusPendingRatings:
            case constants.SORT_BY.statusPendingRatings:
            case constants.SORT_BY.statusCompleted:
            case constants.SORT_BY.recent:
            default:
              sortedArr = sortTasksByUserTags(currentUserTags, getTasksResult);
              break;
          }

          dispatch(actionCreators.setTasksFromBackEnd(sortedArr));
        }
      } catch (error) {
        console.log(`catchError at useEffect : ${error.stack}`);
      }
    };
    setInterval(() => {
      init();
    }, 5000);
  }, [api?.query.palletTasking]);

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
        : formTypeOnClick === 'Provide Customer Ratings'
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
        : 'Form';

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
          <h2 style={{ margin: '0' }}>Marketplace</h2>
          {/* <Button
            name={constants.FORM_TYPES.CREATE_TASK.type}
            onClick={(e) => {
              if (!isWalletConnected) {
                toast.error(`Connect crypto wallet`, {
                  position: toast.POSITION.TOP_RIGHT,
                  autoClose: 2000,
                });
              } else {
                showFormModal(e, null);
              }
            }}
          >
            Create New Task
          </Button> */}
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

      <Row>
        {!tasks.length && (
          // <span style={{ marginLeft: "45px" }} className="p-2">
          //     Showing Demo Data, You can create a new Task!
          // </span>
          <Empty description={<span>Create new tasks</span>} />
        )}
        {tasks.length > 0 &&
          tasks.map((task, index) => (
            <TaskCard data={task} showFormModal={showFormModal} key={index} />
          ))}
      </Row>
      <TaskModal
        show={show}
        handleClose={handleClose}
        configForBackEnd={{ api, keyring }}
        formTypeAndData={currentFormTypeAndData}
      />
    </>
  );
};

const TaskModal = ({
  show,
  handleClose,
  configForBackEnd,
  formTypeAndData,
}) => {
  const { formType } = formTypeAndData;
  const { type, title } = formType;

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>
            <b>{title}</b>
          </Modal.Title>
          <Modal.Title onClick={handleClose} style={{ cursor: 'pointer' }}>
            &#10005;
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TaskFormFormik
            configForBackEnd={configForBackEnd}
            formTypeAndData={formTypeAndData}
            handleClose={handleClose}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DashBoard;
