import React, { useState, useEffect } from 'react';
import {
  Badge,
  Card,
  Col,
  Image,
  Row,
  Button,
  Modal,
  Form,
  FormControl,
} from 'react-bootstrap';
import {
  ErrorMessage,
  Field,
  Form as FormikForm,
  Formik,
  useField,
} from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';
import { DEFAULT_SUBSTRATE_ACCOUNTS_IDS, TASK_STATUS } from './constants';
import { getAttributesForCard } from '../DashBoard/helpers';
import { TASK_OPEN_LOGO } from '../../../constants/constants';
import { getJuror } from './helpers';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  castVoteTx,
  sudoJurorCastVoteTx,
} from '../../../palletTaskingFunctions';
import { useSubstrateState } from '../../../substrate-lib';

const FinalJurors = ({ tab }) => {
  const { api } = useSubstrateState();
  const [modalShow, setModalShow] = useState(false);
  const [attributesForCard, setAttributesForCard] = useState({});
  const { tabId, tabType, task } = tab;
  const tasks = useSelector((state) => state.dashBoardReducer.tasks);

  const {
    client,
    cost,
    status,
    taskDeadline,
    taskDescription,
    taskId,
    workerId,
  } = task;

  let reduxTask = tasks.filter((task) => task.taskId === taskId)[0];
  useEffect(() => {
    reduxTask = tasks.filter((task) => task.taskId === taskId)[0];
  }, [tasks]);

  const currentWalletDetails = useSelector(
    (state) => state.headerReducer.currentWalletDetails
  );

  const isWalletConnected = useSelector(
    (state) => state.headerReducer.isWalletConnected
  );

  const init = () => {
    setAttributesForCard(getAttributesForCard(status));
  };

  let initialValues = {
    accountName: currentWalletDetails.meta.name,
    accountId: currentWalletDetails.address,
    taskId: taskId,
    votedFor: '',
    ratingsForWorker: '',
    ratingsForCustomer: '',
  };

  const finalJurorCastVote = async (votedFor, customerRating, workerRating) => {
    await castVoteTx(
      api,
      currentWalletDetails.address,
      task.taskId,
      votedFor,
      customerRating,
      workerRating
    );
  };

  const sudoJurorCastVote = async (votedFor, customerRating, workerRating) => {
    await sudoJurorCastVoteTx(
      api,
      currentWalletDetails.address,
      task.taskId,
      votedFor,
      customerRating,
      workerRating
    );
  };

  const handleFinalJurorFormSubmit = async (data) => {
    try {
      console.log('Form data:', data);
      finalJurorCastVote(
        data.votedFor,
        data.ratingsForCustomer,
        data.ratingsForWorker
      );
    } catch (error) {
      console.log(error);
      toast.error(`Use Default Accounts Alice or Bob, Error: ${error}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    }
  };

  const handleSudoJurorFormSubmit = async (data) => {
    try {
      console.log('Form data:', data);
      sudoJurorCastVote(
        data.votedFor,
        data.ratingsForCustomer,
        data.ratingsForWorker
      );
    } catch (error) {
      console.log(error);
      toast.error(`Use Default Accounts Alice or Bob, Error: ${error}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    }
  };

  const handleClose = () => setModalShow(false);

  const FixedCardHeight = {
    height: '600px',
  };

  useEffect(() => {
    init();
    return () => {};
  }, []);

  return (
    <Card.Body>
      {reduxTask?.dispute?.sudoJuror ? (
        <>
          <Row>
            <Col md={8} xs={8} sm={8} lg={8}>
              <div
                className="d-flex flex-column justify-content-start align-items-start"
                style={{ gap: '10px' }}
              >
                <li>{getJuror(reduxTask?.dispute?.sudoJuror)}</li>
              </div>
            </Col>
            <Col md={4} xs={4} sm={4} lg={4}>
              <div className="d-flex justify-content-center align-items-center h-100">
                <Button
                  variant="outline-primary"
                  disabled={
                    reduxTask?.status === TASK_STATUS.Completed ? true : false
                  }
                  onClick={() => {
                    if (isWalletConnected) {
                      setModalShow(true);
                    } else {
                      toast.error(`Please connect to a wallet provider`, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 3000,
                      });
                    }
                  }}
                >
                  Cast Vote
                </Button>
              </div>

              <Modal
                show={modalShow}
                onHide={() => setModalShow(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
              >
                <Modal.Header>
                  <Modal.Title id="contained-modal-title-vcenter">
                    <h3>Cast your vote here</h3>
                  </Modal.Title>
                  <Modal.Title
                    onClick={() => setModalShow(false)}
                    style={{ cursor: 'pointer' }}
                  >
                    &#10005;
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <div>
                    <Formik
                      initialValues={initialValues}
                      // validationSchema={validationSchema}
                      enableReinitialize
                      onSubmit={async (data, { setSubmitting, resetForm }) => {
                        console.log('form data', data);
                        setSubmitting(true);
                        await handleSudoJurorFormSubmit(data);
                        setSubmitting(false);
                        resetForm();
                        handleClose();
                      }}
                    >
                      {({
                        values,
                        errors,
                        isSubmitting,
                        resetForm,
                        handleSubmit,
                        setFieldValue,
                        handleChange,
                      }) => (
                        <FormikForm>
                          <Card
                            className="text-left form p-1"
                            style={{ ...FixedCardHeight }}
                          >
                            <Card.Body
                              className="form-body"
                              style={{ overflow: 'scroll' }}
                            >
                              <FormLabelAndInput
                                label="Account Name"
                                name="accountName"
                                helperText={'Connected Wallet Account'}
                                isDisabled={true}
                                value={currentWalletDetails.meta.name}
                              />
                              <FormLabelAndInput
                                // placeholder={
                                //   !values.isFieldDisabled ? `AccountId` : ''
                                // }
                                name="accountId"
                                // type={!values.isFieldDisabled ? 'text' : 'text'}
                                label="AccountId"
                                helperText={''}
                                isDisabled={true}
                                value={currentWalletDetails.address}
                              />

                              <FormLabelAndInput
                                // placeholder={
                                //   !values.isFieldDisabled ? `TaskId` : ''
                                // }
                                name="taskId"
                                // type={!values.isFieldDisabled ? 'number' : 'text'}
                                label="TaskId"
                                helperText={''}
                                value={taskId}
                                isDisabled={true}
                              />

                              <FormLabelAndDropDown
                                label="Voted For"
                                name="votedFor"
                                helperText={''}
                                options={['Worker', 'Customer']}
                              />

                              <FormLabelAndInput
                                placeholder={`Ratings for Worker`}
                                name="ratingsForWorker"
                                type={'number'}
                                label={`Ratings for Worker`}
                                helperText={'Provide ratings between 1-5'}
                              />

                              <FormLabelAndInput
                                placeholder={`Ratings for Customer`}
                                name="ratingsForCustomer"
                                type={'number'}
                                label={`Ratings for Customer`}
                                helperText={'Provide ratings between 1-5'}
                              />
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-between aligin-items-center">
                              <Button variant="warning" onClick={resetForm}>
                                <b>Reset</b>
                              </Button>
                              <Button
                                variant="dark"
                                type="submit"
                                name="submit"
                              >
                                <b>Submit</b>
                              </Button>
                            </Card.Footer>
                          </Card>
                        </FormikForm>
                      )}
                    </Formik>
                  </div>
                </Modal.Body>
              </Modal>
            </Col>
          </Row>
        </>
      ) : (
        <>
          {Object.keys(reduxTask?.dispute?.finalJurors).map((juror, idx) => (
            <Row key={idx} style={{ marginBottom: '10px' }}>
              <Col md={8} xs={8} sm={8} lg={8}>
                <div
                  className="d-flex flex-column justify-content-start align-items-start"
                  style={{ gap: '10px' }}
                >
                  <li>{getJuror(juror)}</li>
                </div>
              </Col>
              <Col md={4} xs={4} sm={4} lg={4}>
                <div className="d-flex justify-content-center align-items-center h-100">
                  <Button
                    variant="outline-primary"
                    disabled={
                      reduxTask?.status === TASK_STATUS.Completed ? true : false
                    }
                    onClick={() => {
                      if (isWalletConnected) {
                        setModalShow(true);
                      } else {
                        toast.error(`Please connect to a wallet provider`, {
                          position: toast.POSITION.TOP_RIGHT,
                          autoClose: 3000,
                        });
                      }
                    }}
                  >
                    Cast Vote
                  </Button>
                </div>

                <Modal
                  show={modalShow}
                  onHide={() => setModalShow(false)}
                  size="lg"
                  aria-labelledby="contained-modal-title-vcenter"
                  centered
                >
                  <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                      <h3>Cast your vote here</h3>
                    </Modal.Title>
                    <Modal.Title
                      onClick={() => setModalShow(false)}
                      style={{ cursor: 'pointer' }}
                    >
                      &#10005;
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <div>
                      <Formik
                        initialValues={initialValues}
                        // validationSchema={validationSchema}
                        enableReinitialize
                        onSubmit={async (
                          data,
                          { setSubmitting, resetForm }
                        ) => {
                          console.log('form data', data);
                          setSubmitting(true);
                          await handleFinalJurorFormSubmit(data);
                          setSubmitting(false);
                          resetForm();
                          handleClose();
                        }}
                      >
                        {({
                          values,
                          errors,
                          isSubmitting,
                          resetForm,
                          handleSubmit,
                          setFieldValue,
                          handleChange,
                        }) => (
                          <FormikForm>
                            <Card
                              className="text-left form p-1"
                              style={{ ...FixedCardHeight }}
                            >
                              <Card.Body
                                className="form-body"
                                style={{ overflow: 'scroll' }}
                              >
                                <FormLabelAndInput
                                  label="Account Name"
                                  name="accountName"
                                  helperText={'Connected Wallet Account'}
                                  isDisabled={true}
                                  value={currentWalletDetails.meta.name}
                                />
                                <FormLabelAndInput
                                  // placeholder={
                                  //   !values.isFieldDisabled ? `AccountId` : ''
                                  // }
                                  name="accountId"
                                  // type={!values.isFieldDisabled ? 'text' : 'text'}
                                  label="AccountId"
                                  helperText={''}
                                  isDisabled={true}
                                  value={currentWalletDetails.address}
                                />

                                <FormLabelAndInput
                                  // placeholder={
                                  //   !values.isFieldDisabled ? `TaskId` : ''
                                  // }
                                  name="taskId"
                                  // type={!values.isFieldDisabled ? 'number' : 'text'}
                                  label="TaskId"
                                  helperText={''}
                                  value={taskId}
                                  isDisabled={true}
                                />

                                <FormLabelAndDropDown
                                  label="Voted For"
                                  name="votedFor"
                                  helperText={''}
                                  options={['Worker', 'Customer']}
                                />

                                <FormLabelAndInput
                                  placeholder={`Ratings for Worker`}
                                  name="ratingsForWorker"
                                  type={'number'}
                                  label={`Ratings for Worker`}
                                  helperText={'Provide ratings between 1-5'}
                                />

                                <FormLabelAndInput
                                  placeholder={`Ratings for Customer`}
                                  name="ratingsForCustomer"
                                  type={'number'}
                                  label={`Ratings for Customer`}
                                  helperText={'Provide ratings between 1-5'}
                                />
                              </Card.Body>
                              <Card.Footer className="d-flex justify-content-between aligin-items-center">
                                <Button variant="warning" onClick={resetForm}>
                                  <b>Reset</b>
                                </Button>
                                <Button
                                  variant="dark"
                                  type="submit"
                                  name="submit"
                                >
                                  <b>Submit</b>
                                </Button>
                              </Card.Footer>
                            </Card>
                          </FormikForm>
                        )}
                      </Formik>
                    </div>
                  </Modal.Body>
                </Modal>
              </Col>
            </Row>
          ))}
        </>
      )}
    </Card.Body>
  );
};

export default FinalJurors;

const FormLabelAndInput = ({ label, helperText, isDisabled, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <Form.Group style={{ minHeight: '12vh' }}>
      <Form.Label className="publish-form-label mtl-5">{label}</Form.Label>
      {!isDisabled && (
        <ErrorMessage
          name={field.name}
          //   component={FormErrorMessage}
        ></ErrorMessage>
      )}
      <Field
        {...field}
        {...props}
        as={FormControl}
        autoComplete="off"
        disabled={isDisabled}
        className="p-2"
      ></Field>
      <span
        style={{
          fontSize: 'small',
          fontWeight: 'lighter',
          padding: '2px',
          margin: '1px',
        }}
      >
        {helperText}
      </span>
    </Form.Group>
  );
};

const FormLabelAndDropDown = ({
  label,
  helperText,
  options,
  selectIndex,
  ...props
}) => {
  const [field, meta] = useField(props);
  return (
    <Form.Group>
      <Form.Label className="publish-form-label mtl-5">{label}</Form.Label>
      <ErrorMessage
        name={field.name}
        // component={FormErrorMessage}
      ></ErrorMessage>
      <Form.Control as="select" {...field} {...props}>
        <option>Select</option>
        {options.map((option, index) => {
          return <option key={index}>{option}</option>;
        })}
      </Form.Control>
      <small>{helperText}</small>
    </Form.Group>
  );
};
