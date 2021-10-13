import React, { useState, useEffect } from "react";
import {
    ErrorMessage,
    Field,
    Form as FormikForm,
    Formik,
    useField,
} from "formik";
import * as Yup from "yup";
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
} from "react-bootstrap";
import { BsFileRichtext } from "react-icons/bs";

import "./TaskFormFormik.css";
import FormErrorMessage from "./FormErrorMessage";
import * as palletTaskingFunctions from "../../../palletTaskingFunctions";
import * as constants from "./constants";
import { useSelector } from "react-redux";
import { Keyring as ExtKeyring } from "@polkadot/keyring";

let initialValues = {
    accountName: "",
    accountId: "",
    taskId: "",
    taskDuration: "",
    taskCost: "",
    taskDescription: "",
    isFieldDisabled: false,
    submitButtonName: "Submit",
    ratings: "",
};

const validationSchema = Yup.object({
    accountName: Yup.string(),
    accountId: Yup.number(),
    taskId: Yup.number(),
    taskDuration: Yup.number().required("Required!"),
    taskCost: Yup.number().required("Required!"),
    taskDescription: Yup.string().required("Required!"),
    isFieldDisabled: Yup.boolean(),
    submitButtonName: Yup.string(),
    ratings: Yup.number(),
});

const TaskFormFormik = ({ configForBackEnd, formTypeAndData, handleClose }) => {
    const { api, keyring } = configForBackEnd;
    const { formType, data } = formTypeAndData;

    const connectedAccounts = useSelector(
        (state) => state.headerReducer.accountsAvailableInWallet
    );
    const defaultAccounts = useSelector(
        (state) => state.headerReducer.defaultAccounts
    );

    const configForForm = () => {
        switch (formType.type) {
            case `Create New Task`:
                initialValues.accountName = "";
                initialValues.accountId = "";
                initialValues.taskId = "";
                initialValues.taskDuration = "";
                initialValues.taskCost = "";
                initialValues.taskDescription = "";
                initialValues.isFieldDisabled = false;
                initialValues.submitButtonName = "Create";
                return;
            case `Bid`:
            case `Complete`:
                initialValues.accountName = "";
                initialValues.accountId = "";
                initialValues.taskId = data.task_id;
                initialValues.taskDuration = data.task_deadline;
                initialValues.taskCost = data.cost;
                initialValues.taskDescription = data.task_description;
                initialValues.isFieldDisabled = true;
                initialValues.submitButtonName =
                    formType.type === `Bid` ? "Bid" : "Complete";
                return;

            case `Approve`:
                initialValues.accountName = "";
                initialValues.accountId = "";
                initialValues.taskId = data.task_id;
                initialValues.taskDuration = data.task_deadline;
                initialValues.taskCost = data.cost;
                initialValues.taskDescription = data.task_description;
                initialValues.isFieldDisabled = true;
                initialValues.submitButtonName = "Approve";
                return;
            case `Provide Customer Ratings`:
                initialValues.accountName = "";
                initialValues.accountId = "";
                initialValues.taskId = data.task_id;
                initialValues.taskDuration = data.task_deadline;
                initialValues.taskCost = data.cost;
                initialValues.taskDescription = data.task_description;
                initialValues.isFieldDisabled = true;
                initialValues.submitButtonName = "Provide Customer Ratings";
                return;
            default:
                return;
        }
    };

    const handleFormSubmit = async (data) => {
        try {
            let extKeyring = new ExtKeyring();

            // let BobFromKeyRing = keyring.getAccount(
            //     palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.BOB
            // );
            // let AliceFromKeyRing = keyring.getAccount(
            //     palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.ALICE
            // );
            // let bob = keyring.getPair(BobFromKeyRing.address);
            // let alice = keyring.getPair(AliceFromKeyRing.address);

            // console.log(alice);
            // console.log(bob);

            let allAcc = [...defaultAccounts, ...connectedAccounts];
            let selectedAccountMeta = (address) => {
                let meta;
                allAcc.forEach((acc) => {
                    if (acc.address === address) {
                        meta = acc;
                    }
                });
                return meta;
            };

            // const pair = extKeyring.addFromAddress(
            //     data.accountId,
            //     selectedAccountMeta(data.accountId).meta,
            //     "sr25519"
            // );
            // console.log("pair", pair);

            let signedAccount = keyring.getPair(data.accountId);
            console.log(signedAccount);

            console.log(`data: ${JSON.stringify(data)}`);

            switch (formType.type) {
                case constants.FORM_TYPES.CREATE_TASK.type:
                    console.log(`create`);
                    const unit = 1000000000000;
                    return await palletTaskingFunctions.createTaskTx(
                        api,
                        signedAccount,
                        data.taskDuration,
                        data.taskCost * unit,
                        data.taskDescription
                    );
                case constants.FORM_TYPES.BID_FOR_TASK.type:
                    return await palletTaskingFunctions.bidForTaskTx(
                        api,
                        signedAccount,
                        data.taskId
                    );
                case constants.FORM_TYPES.COMPLETE_TASK.type:
                    return await palletTaskingFunctions.taskCompletedTx(
                        api,
                        signedAccount,
                        data.taskId
                    );

                case constants.FORM_TYPES.APPROVE_TASK.type:
                    return await palletTaskingFunctions.approveTaskTx(
                        api,
                        signedAccount,
                        data.taskId,
                        data.ratings
                    );

                case constants.FORM_TYPES.PROVIDE_CUSTOMER_RATINGS.type:
                    return await palletTaskingFunctions.provideCustomerRatingsTx(
                        api,
                        signedAccount,
                        data.taskId
                    );

                default:
                    break;
            }
        } catch (error) {
            toast.error(`Use Default Accounts Alice or Bob, Error: ${err}`, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 5000,
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
                    handleFormSubmit(data);
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
                        <Card className="text-left form p-1">
                            <Card.Body className="form-body">
                                <FormLabelAndDropDown
                                    label="Account Name"
                                    name="accountName"
                                    helperText={"Select valid account"}
                                    options={[
                                        ...connectedAccounts,
                                        ...defaultAccounts,
                                    ].map((acc) => acc.meta.name)}
                                    onChange={(e) => {
                                        setFieldValue(
                                            "accountName",
                                            e.target.value,
                                            false
                                        );
                                        let val;
                                        [
                                            ...connectedAccounts,
                                            ...defaultAccounts,
                                        ]?.forEach((acc) => {
                                            if (
                                                acc.meta.name === e.target.value
                                            ) {
                                                val = acc.address;
                                                return;
                                            }
                                        });
                                        setFieldValue("accountId", val);
                                    }}
                                />
                                <FormLabelAndInput
                                    placeholder={
                                        !values.isFieldDisabled
                                            ? `AccountId`
                                            : ""
                                    }
                                    name="accountId"
                                    type={
                                        !values.isFieldDisabled
                                            ? "text"
                                            : "text"
                                    }
                                    label="AccountId"
                                    helperText={""}
                                    isDisabled={true}
                                />
                                {formType.type !==
                                    constants.FORM_TYPES.CREATE_TASK.type && (
                                    <FormLabelAndInput
                                        placeholder={
                                            !values.isFieldDisabled
                                                ? `TaskId`
                                                : ""
                                        }
                                        name="taskId"
                                        type={
                                            !values.isFieldDisabled
                                                ? "number"
                                                : "text"
                                        }
                                        label="TaskId"
                                        helperText={""}
                                        // value={values.taskId}
                                        isDisabled={values.isFieldDisabled}
                                    />
                                )}
                                <FormLabelAndInput
                                    placeholder={
                                        !values.isFieldDisabled
                                            ? `TaskDuration`
                                            : ""
                                    }
                                    name="taskDuration"
                                    type={
                                        !values.isFieldDisabled
                                            ? "number"
                                            : "text"
                                    }
                                    label="Task Duration"
                                    helperText={""}
                                    // value={values.taskDuration}
                                    isDisabled={values.isFieldDisabled}
                                />
                                <FormLabelAndInput
                                    placeholder={
                                        !values.isFieldDisabled
                                            ? `TaskCost`
                                            : ""
                                    }
                                    name="taskCost"
                                    type={
                                        !values.isFieldDisabled
                                            ? "number"
                                            : "text"
                                    }
                                    label="Task Cost"
                                    helperText={""}
                                    // value={values.taskCost}
                                    isDisabled={values.isFieldDisabled}
                                />
                                <FormLabelAndInput
                                    placeholder={
                                        !values.isFieldDisabled
                                            ? `TaskDescription`
                                            : ""
                                    }
                                    name="taskDescription"
                                    type="text"
                                    label="Task Description"
                                    helperText={""}
                                    // value={values.taskDescription}
                                    isDisabled={values.isFieldDisabled}
                                />

                                {(formType.type ===
                                    constants.FORM_TYPES.APPROVE_TASK.type ||
                                    formType.type ===
                                        constants.FORM_TYPES
                                            .PROVIDE_CUSTOMER_RATINGS.type) && (
                                    <FormLabelAndInput
                                        placeholder={
                                            formType.type ===
                                            constants.FORM_TYPES.APPROVE_TASK
                                                .type
                                                ? `Ratings for Worker`
                                                : `Ratings for Customer`
                                        }
                                        name="ratings"
                                        type={"number"}
                                        label={
                                            formType.type ===
                                            constants.FORM_TYPES.APPROVE_TASK
                                                .type
                                                ? `Ratings for Worker`
                                                : `Ratings for Customer`
                                        }
                                        helperText={
                                            "Provide ratings between 1-5"
                                        }
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
        <Form.Group style={{ minHeight: "12vh" }}>
            <Form.Label className="publish-form-label mtl-5">
                {label}
            </Form.Label>
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
                    fontSize: "small",
                    fontWeight: "lighter",
                    padding: "2px",
                    margin: "1px",
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
            <Form.Label className="publish-form-label mtl-5">
                {label}
            </Form.Label>
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
            <span style={{ fontSize: "small" }}>{helperText}</span>
        </Form.Group>
    );
};

const FormLabelAndDropDown = ({ label, helperText, options, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <Form.Group>
            <Form.Label className="publish-form-label mtl-5">
                {label}
            </Form.Label>
            <ErrorMessage
                name={field.name}
                component={FormErrorMessage}
            ></ErrorMessage>
            <Form.Control as="select" {...field} {...props}>
                <option>Select</option>
                {options.map((option, index) => (
                    <option key={index}>{option}</option>
                ))}
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

export default TaskFormFormik;
