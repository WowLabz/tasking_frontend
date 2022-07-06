import React, { useState, useEffect } from 'react';
import {
  ErrorMessage,
  Field,
  Form as FormikForm,
  Formik,
  useField,
} from 'formik';
import * as Yup from 'yup';
import {
  Card,
  Form,
  FormControl,
  Button,
  Col,
  Row,
  Badge,
  Modal,
  Spinner,
} from 'react-bootstrap';
import Select from 'react-select';
import { Upload, Select as AntSelect } from 'antd';
import makeAnimated from 'react-select/animated';
import { InboxOutlined } from '@ant-design/icons';
import './TaskFormFormik.css';
import FormErrorMessage from './FormErrorMessage';
import * as palletTaskingFunctions from '../../../palletTaskingFunctions';
import * as constants from './constants';
import { useSelector } from 'react-redux';
import { Keyring as ExtKeyring } from '@polkadot/keyring';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { DEFAULT_POLKA_ACCOUNTS } from '../../../Components/AppHeader/constants';
import { uploadFileToServer } from '../Authorization/actionCreators';
toast.configure();

let initialValues = {
  accountName: '',
  accountId: '',
  taskId: '',
  taskDuration: '',
  taskCost: '',
  taskDescription: '',
  taskTags: [],
  workerRating: '',
  customerRating: '',
  isFieldDisabled: false,
  submitButtonName: 'Submit',
  ratings: '',
  files: '',
  attachments: [],
};

const validationSchema = Yup.object({
  accountName: Yup.string(),
  accountId: Yup.number(),
  taskId: Yup.number(),
  taskDuration: Yup.number().required('Required!'),
  taskCost: Yup.number().required('Required!'),
  taskDescription: Yup.string().required('Required!'),
  isFieldDisabled: Yup.boolean(),
  submitButtonName: Yup.string(),
  ratings: Yup.number(),
});

const FixedCardHeight = {
  height: '600px',
};

const DivHeight = {
  height: '100px',
};

const TaskFormFormik = ({ configForBackEnd, formTypeAndData, handleClose }) => {
  const { api, keyring } = configForBackEnd;
  const { formType, data } = formTypeAndData;

  const currentWalletDetails = useSelector(
    (state) => state.headerReducer.currentWalletDetails
  );

  const isWalletConnected = useSelector(
    (state) => state.headerReducer.isWalletConnected
  );

  const connectedAccounts = useSelector(
    (state) => state.headerReducer.accountsAvailableInWallet
  );
  const defaultAccounts = useSelector(
    (state) => state.headerReducer.defaultAccounts
  );

  const taskTagsForForm = useSelector(
    (state) => state.authenticationReducer.userTags
  );

  const configForForm = () => {
    switch (formType.type) {
      case `Create New Task`:
        initialValues.accountName = currentWalletDetails.meta.name;
        initialValues.accountId = currentWalletDetails.address;
        initialValues.taskId = '';
        initialValues.taskDuration = '';
        initialValues.taskCost = '';
        initialValues.taskDescription = '';
        initialValues.isFieldDisabled = false;
        initialValues.submitButtonName = 'Create';
        return;
      case `Bid`:
      case `Complete`:
        initialValues.accountName = currentWalletDetails.meta.name;
        initialValues.accountId = currentWalletDetails.address;
        initialValues.taskId = data.taskId;
        initialValues.taskDuration = data.taskDeadline;
        initialValues.taskCost = data.cost;
        initialValues.taskDescription = data.taskDescription;
        initialValues.isFieldDisabled = true;
        initialValues.submitButtonName =
          formType.type === `Bid` ? 'Bid' : 'Complete';
        return;

      case `Approve`:
        initialValues.accountName = currentWalletDetails.meta.name;
        initialValues.accountId = currentWalletDetails.address;
        initialValues.taskId = data.taskId;
        initialValues.taskDuration = data.taskDeadline;
        initialValues.taskCost = data.cost;
        initialValues.taskDescription = data.taskDescription;
        initialValues.isFieldDisabled = true;
        initialValues.submitButtonName = 'Approve';
        return;
      case `Provide Customer Ratings`:
        initialValues.accountName = currentWalletDetails.meta.name;
        initialValues.accountId = currentWalletDetails.address;
        initialValues.taskId = data.taskId;
        initialValues.taskDuration = data.taskDeadline;
        initialValues.taskCost = data.cost;
        initialValues.taskDescription = data.taskDescription;
        initialValues.isFieldDisabled = true;
        initialValues.submitButtonName = 'Provide Customer Ratings';
        return;
      case `Close`:
        initialValues.accountName = currentWalletDetails.meta.name;
        initialValues.accountId = currentWalletDetails.address;
        initialValues.taskId = data.taskId;
        initialValues.taskDuration = data.taskDeadline;
        initialValues.taskCost = data.cost;
        initialValues.taskDescription = data.taskDescription;
        initialValues.isFieldDisabled = true;
        initialValues.submitButtonName = 'Close';
        return;
      case `Raise Dispute`:
        initialValues.accountName = currentWalletDetails.meta.name;
        initialValues.accountId = currentWalletDetails.address;
        initialValues.taskId = data.taskId;
        initialValues.taskDuration = data.taskDeadline;
        initialValues.taskCost = data.cost;
        initialValues.taskDescription = data.taskDescription;
        initialValues.isFieldDisabled = true;
        initialValues.submitButtonName = 'Raise Dispute';
        return;
      case `Disapprove`:
        initialValues.accountName = currentWalletDetails.meta.name;
        initialValues.accountId = currentWalletDetails.address;
        initialValues.taskId = data.taskId;
        initialValues.taskDuration = data.taskDeadline;
        initialValues.taskCost = data.cost;
        initialValues.taskDescription = data.taskDescription;
        initialValues.isFieldDisabled = true;
        initialValues.submitButtonName = 'Disapprove';
        return;
      case `Disapprove Worker Ratings`:
        initialValues.accountName = currentWalletDetails.meta.name;
        initialValues.accountId = currentWalletDetails.address;
        initialValues.taskId = data.taskId;
        initialValues.taskDuration = data.taskDeadline;
        initialValues.taskCost = data.cost;
        initialValues.taskDescription = data.taskDescription;
        initialValues.workerRating = data.finalWorkerRating;
        initialValues.isFieldDisabled = true;
        initialValues.submitButtonName = 'Disapprove Worker Ratings';
        return;
      case `Disapprove Customer Ratings`:
        initialValues.accountName = currentWalletDetails.meta.name;
        initialValues.accountId = currentWalletDetails.address;
        initialValues.taskId = data.taskId;
        initialValues.taskDuration = data.taskDeadline;
        initialValues.taskCost = data.cost;
        initialValues.taskDescription = data.taskDescription;
        initialValues.customerRating = data.finalCustomerRating;
        initialValues.isFieldDisabled = true;
        initialValues.submitButtonName = 'Disapprove Customer Ratings';
        return;
      default:
        return;
    }
  };

  const handleFormSubmit = async (data) => {
    try {

      switch (formType.type) {
        case constants.FORM_TYPES.CREATE_TASK.type:
          const unit = 1000000000000;
          return await palletTaskingFunctions.createTaskTx(
            api,
            data.accountId,
            data.taskDuration,
            data.taskCost * unit,
            data.taskDescription,
            data.accountName,
            data.taskTags,
            data.attachments
          );
        case constants.FORM_TYPES.BID_FOR_TASK.type:
          return await palletTaskingFunctions.bidForTaskTx(
            api,
            data.accountId,
            data.taskId,
            data.accountName
          );
        case constants.FORM_TYPES.COMPLETE_TASK.type:
          return await palletTaskingFunctions.taskCompletedTx(
            api,
            data.accountId,
            data.taskId,
            data.attachments
          );

        case constants.FORM_TYPES.APPROVE_TASK.type:
          return await palletTaskingFunctions.approveTaskTx(
            api,
            data.accountId,
            data.taskId,
            data.ratings
          );

        case constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type:
          return await palletTaskingFunctions.provideCustomerRatingsTx(
            api,
            data.accountId,
            data.taskId,
            data.ratings
          );

        case constants.FORM_TYPES.CLOSE_TASK.type:
          return await palletTaskingFunctions.closeTaskTx(
            api,
            data.accountId,
            data.taskId
          );

        case constants.FORM_TYPES.RAISE_DISPUTE.type: {
          let userType = getUserType();
          return await palletTaskingFunctions.raiseDisputeTx(
            api,
            data.accountId,
            data.taskId,
            userType
          );
        }

        case constants.FORM_TYPES.DISAPPROVE_TASK.type: {
          let userType = getUserType();

          if (userType === constants.USER_TYPE.WORKER) {
            toast.error(`Only Customer Can Disapprove`, {
              autoClose: 3000,
              position: 'bottom-right',
            });
            return;
          }

          return await palletTaskingFunctions.disapproveTaskTx(
            api,
            data.accountId,
            data.taskId
          );
        }

        case constants.FORM_TYPES.DISAPPROVE_WORKER_RATINGS.type: {
          let userType = getUserType();

          if (userType !== constants.USER_TYPE.CUSTOMER) {
            toast.error(`Only Customer Can Disapprove The Worker's Ratings`, {
              autoClose: 3000,
              position: 'bottom-right',
            });
            return;
          }

          return await palletTaskingFunctions.disapproveRatingTx(
            api,
            data.accountId,
            data.taskId,
            constants.USER_TYPE.WORKER
          );
        }

        case constants.FORM_TYPES.DISAPPROVE_CUSTOMER_RATINGS.type: {
          let isWorker = getIsWorker();

          if (!isWorker) {
            toast.error(`Only Worker Can Disapprove The Customer's Ratings`, {
              autoClose: 3000,
              position: 'bottom-right',
            });
            return;
          }

          return await palletTaskingFunctions.disapproveRatingTx(
            api,
            data.accountId,
            data.taskId,
            constants.USER_TYPE.CUSTOMER
          );
        }

        default:
          break;
      }
    } catch (error) {
      toast.error(`Use Default Accounts Alice or Bob, Error: ${error}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 5000,
      });
    }
  };

  const getIsWorker = () => {
    return data.workerId === currentWalletDetails.address ? true : false;
  };

  const getUserType = () => {
    return data.publisher === currentWalletDetails.address
      ? constants.USER_TYPE.CUSTOMER
      : constants.USER_TYPE.WORKER;
  };

  const handleFileUpload = async (files) => {
    try {
      if (files.length === 0) return;

      let totalNumberOfFiles = files.length;
      let attachments = [];

      for (let i = 0; i < totalNumberOfFiles; i++) {
        let formData = new FormData();
        formData.append('somefile', files[i].originFileObj);
        let fileRes = await uploadFileToServer(formData);
        attachments.push(fileRes.url);
      }

      toast.success(`${totalNumberOfFiles} files uploaded successfully!`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
      return attachments;
    } catch (error) {
      toast.error(`File Upload Error: ${error}`, {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    configForForm();
  }, []);

  return (
    <>
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        enableReinitialize
        onSubmit={async (data, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          let currTasksTags = data.taskTags;
          let newTaskTagsArr = [];
          currTasksTags.forEach((tag) => newTaskTagsArr.push(tag.value));
          data.taskTags = newTaskTagsArr;

          if (data.files.length !== 0) {
            let attachments = await handleFileUpload(data.files);
            data.attachments = attachments;
          } else {
            data.attachments = [];
          }
          await handleFormSubmit(data);
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
            <Card className="text-left form p-1" style={{ ...FixedCardHeight }}>
              <Card.Body className="form-body" style={{ overflow: 'scroll' }}>
                <FormLabelAndInput
                  label="Account Name"
                  name="accountName"
                  helperText={'Connected Wallet Account'}
                  isDisabled={true}
                  // options={[currentWalletDetails]?.map(
                  //     (acc) => acc.meta.name
                  // )}
                  // onChange={(e) => {
                  //     setFieldValue(
                  //         "accountName",
                  //         e.target.value,
                  //         false
                  //     );
                  //     let val;
                  //     [
                  //         ...connectedAccounts,
                  //         ...defaultAccounts,
                  //     ]?.forEach((acc) => {
                  //         if (
                  //             acc.meta.name ===
                  //             e.target.value
                  //         ) {
                  //             val = acc.address;
                  //             return;
                  //         }
                  //     });
                  //     setFieldValue("accountId", val);
                  // }}
                  // value={currentWalletDetails.meta.name}
                />
                <FormLabelAndInput
                  placeholder={!values.isFieldDisabled ? `AccountId` : ''}
                  name="accountId"
                  type={!values.isFieldDisabled ? 'text' : 'text'}
                  label="AccountId"
                  helperText={''}
                  isDisabled={true}
                  // value={currentWalletDetails.address}
                />
                {formType.type !== constants.FORM_TYPES.CREATE_TASK.type && (
                  <FormLabelAndInput
                    placeholder={!values.isFieldDisabled ? `TaskId` : ''}
                    name="taskId"
                    type={!values.isFieldDisabled ? 'number' : 'text'}
                    label="TaskId"
                    helperText={''}
                    // value={values.taskId}
                    isDisabled={values.isFieldDisabled}
                  />
                )}
                <FormLabelAndInput
                  placeholder={
                    !values.isFieldDisabled ? `TaskDuration (in Days)` : ''
                  }
                  name="taskDuration"
                  type={!values.isFieldDisabled ? 'number' : 'text'}
                  label="Task Duration (in Days)"
                  helperText={''}
                  // value={values.taskDuration}
                  isDisabled={values.isFieldDisabled}
                />
                <FormLabelAndInput
                  placeholder={
                    !values.isFieldDisabled ? `TaskCost (in Units)` : ''
                  }
                  name="taskCost"
                  type={!values.isFieldDisabled ? 'number' : 'text'}
                  label="Task Cost (in Units)"
                  helperText={''}
                  // value={values.taskCost}
                  isDisabled={values.isFieldDisabled}
                />

                <FormLabelAndInput
                  placeholder={!values.isFieldDisabled ? `TaskDescription` : ''}
                  name="taskDescription"
                  type="text"
                  label="Task Description"
                  helperText={''}
                  // value={values.taskDescription}
                  isDisabled={values.isFieldDisabled}
                />

                {formType.type ===
                  constants.FORM_TYPES.DISAPPROVE_WORKER_RATINGS.type && (
                  <FormLabelAndInput
                    name="workerRating"
                    type="text"
                    label="Worker Rating"
                    helperText={''}
                    // value={values.taskDescription}
                    isDisabled={values.isFieldDisabled}
                  />
                )}

                {formType.type ===
                  constants.FORM_TYPES.DISAPPROVE_CUSTOMER_RATINGS.type && (
                  <FormLabelAndInput
                    name="customerRating"
                    type="text"
                    label="Customer Rating"
                    helperText={''}
                    // value={values.taskDescription}
                    isDisabled={values.isFieldDisabled}
                  />
                )}

                {formType.type === constants.FORM_TYPES.CREATE_TASK.type && (
                  <FormLabelAndDropDownWithMultipleValue
                    label="Task Tags"
                    name="taskTags"
                    helperText={'choose approprotiate tags'}
                    options={[...taskTagsForForm]}
                    onChange={(value) =>
                      setFieldValue('taskTags', value, false)
                    }
                    isDisabled={values.isFieldDisabled}
                  />
                )}

                {(formType.type === constants.FORM_TYPES.CREATE_TASK.type ||
                  formType.type ===
                    constants.FORM_TYPES.COMPLETE_TASK.type) && (
                  <FormFile
                    name="files"
                    label="Upload Files"
                    helperText={''}
                    onChange={({ fileList }) =>
                      setFieldValue('files', fileList)
                    }
                  />
                )}
                {(formType.type === constants.FORM_TYPES.APPROVE_TASK.type ||
                  formType.type ===
                    constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type) && (
                  <FormLabelAndInput
                    placeholder={
                      formType.type === constants.FORM_TYPES.APPROVE_TASK.type
                        ? `Ratings for Worker`
                        : `Ratings for Customer`
                    }
                    name="ratings"
                    type={'number'}
                    label={
                      formType.type === constants.FORM_TYPES.APPROVE_TASK.type
                        ? `Ratings for Worker`
                        : `Ratings for Customer`
                    }
                    helperText={'Provide ratings between 1-5'}
                  />
                )}
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between aligin-items-center">
                <Button variant="warning" onClick={resetForm}>
                  <b>Reset</b>
                </Button>
                <Button
                  variant="dark"
                  type="submit"
                  name={values.submitButtonName}
                >
                  <b>{values.submitButtonName}</b>
                </Button>
              </Card.Footer>
            </Card>
          </FormikForm>
        )}
      </Formik>
    </>
  );
};

const FormLabelAndInput = ({ label, helperText, isDisabled, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <Form.Group style={{ minHeight: '12vh' }}>
      <Form.Label className="publish-form-label mtl-5">{label}</Form.Label>
      {!isDisabled && (
        <ErrorMessage
          name={field.name}
          component={FormErrorMessage}
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

const FormLabelAndTextArea = ({
  label,
  rows,
  helperText,
  isDisabled,
  ...props
}) => {
  const [field, meta] = useField(props);
  return (
    <Form.Group>
      <Form.Label className="publish-form-label mtl-5">{label}</Form.Label>
      {!isDisabled && (
        <ErrorMessage
          name={field.name}
          component={FormErrorMessage}
        ></ErrorMessage>
      )}
      <Form.Control
        {...field}
        {...props}
        as="textarea"
        rows={rows}
        disabled={isDisabled}
        className="p-3"
      />
      <span style={{ fontSize: 'small' }}>{helperText}</span>
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
        component={FormErrorMessage}
      ></ErrorMessage>
      <Form.Control as="select" {...field} {...props}>
        <option>Select</option>
        {options.map((option, index) => {
          return (
            <option key={index} selected>
              {option}
            </option>
          );
        })}
      </Form.Control>
      <small>{helperText}</small>
    </Form.Group>
  );
};

const FormCheckBoxAndText = ({ text, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <Form.Group className="p-2 mtl-5">
      <Form.Check {...field} {...props} type="checkbox" label={text} />
      <ErrorMessage
        name={field.name}
        component={FormErrorMessage}
      ></ErrorMessage>
    </Form.Group>
  );
};

const FormFile = ({ helperText, label, ...props }) => {
  const [field, meta] = useField(props);
  const { Dragger } = Upload;

  const draggerProps = {
    name: `${field.name}`,
    multiple: true,
    beforeUpload: () => {
      return false;
    },
    // onChange: `${props.onChange}`,
    // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    // onChange: (info) => {
    //     const { status } = info.file;
    //     if (status !== "uploading") {
    //     }
    //     if (status === "done") {
    //         message.success(
    //             `${info.file.name} file uploaded successfully.`
    //         );
    //     } else if (status === "error") {
    //         message.error(`${info.file.name} file upload failed.`);
    //     }
    // },
    // onDrop: (e) => {
    // },
  };
  return (
    <Form.Group controlId="formFileMultiple" className="mb-3">
      <Form.Label className="publish-form-label mtl-5">{label}</Form.Label>
      <ErrorMessage
        name={field.name}
        component={FormErrorMessage}
      ></ErrorMessage>
      <Dragger {...draggerProps} onChange={props.onChange}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag file to this area to upload
        </p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibit from uploading
          company data or other band files
        </p>
      </Dragger>
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

const FormLabelAndDropDownWithMultipleValue = ({
  label,
  helperText,
  options,
  isDisabled,
  ...props
}) => {
  const [field, meta] = useField(props);
  const animatedComponents = makeAnimated();
  let newOptions = options.map((tag) => ({ value: tag, label: tag }));

  return (
    <Form.Group className="my-2">
      <Form.Label className="publish-form-label mtl-5">{label}</Form.Label>
      <ErrorMessage
        name={field.name}
        component={FormErrorMessage}
      ></ErrorMessage>
      <Select
        {...props}
        isMulti
        defaultValue={isDisabled ? newOptions : []}
        options={!isDisabled ? newOptions : []}
        className="basic-multi-select"
        classNamePrefix="select"
        closeMenuOnSelect={false}
        components={animatedComponents}
        placeholder={helperText}
        isDisabled={isDisabled}
        onChange={props.onChange}
      />
    </Form.Group>
  );
};

const FormLabelAndSelectedDropDown = ({
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
        component={FormErrorMessage}
      ></ErrorMessage>
      <Form.Control as="select" {...field} {...props}>
        {options.map((option, index) => {
          return <option key={index}>{option}</option>;
        })}
      </Form.Control>
      <small>{helperText}</small>
    </Form.Group>
  );
};

export default TaskFormFormik;
