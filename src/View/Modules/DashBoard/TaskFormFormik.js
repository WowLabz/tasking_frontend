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

let initialValues = {
    requestorName: "",
    accountId: "",
    taskId: "",
    taskDuration: "",
    taskCost: "",
    taskDescription: "",
    isFieldDisabled: false,
    submitButtonName: "Submit",
};

const validationSchema = Yup.object({
    requestorName: Yup.string(),
    accountId: Yup.number(),
    taskId: Yup.number(),
    taskDuration: Yup.number().required("Required!"),
    taskCost: Yup.number().required("Required!"),
    taskDescription: Yup.string().required("Required!"),
    isFieldDisabled: Yup.boolean(),
    submitButtonName: Yup.string(),
});

const TaskFormFormik = ({ configForBackEnd, formTypeAndData, handleClose }) => {
    const { api, keyring } = configForBackEnd;
    const { formType, data } = formTypeAndData;

    const configForForm = () => {
        switch (formType.type) {
            case `Create New Task`:
                initialValues.requestorName = "Alice";
                initialValues.accountId =
                    palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.ALICE;
                initialValues.taskId = "";
                initialValues.taskDuration = "";
                initialValues.taskCost = "";
                initialValues.taskDescription = "";
                initialValues.isFieldDisabled = false;
                initialValues.submitButtonName = "Create";
                return;
            case `Bid`:
            case `Complete`:
                initialValues.requestorName = "Bob";
                initialValues.accountId =
                    palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.BOB;
                initialValues.taskId = data.task_id;
                initialValues.taskDuration = data.task_deadline;
                initialValues.taskCost = data.cost;
                initialValues.taskDescription = data.task_description;
                initialValues.isFieldDisabled = true;
                initialValues.submitButtonName =
                    formType.type === `Bid` ? "Bid" : "Complete";
                return;

            case `Approve`:
                initialValues.requestorName = "Alice";
                initialValues.accountId =
                    palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.ALICE;
                initialValues.taskId = data.task_id;
                initialValues.taskDuration = data.task_deadline;
                initialValues.taskCost = data.cost;
                initialValues.taskDescription = data.task_description;
                initialValues.isFieldDisabled = true;
                initialValues.submitButtonName = "Approve";
                return;
            default:
                return;
        }
    };

    const handleFormSubmit = async (data) => {
        let BobFromKeyRing = keyring.getAccount(
            palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.BOB
        );
        let AliceFromKeyRing = keyring.getAccount(
            palletTaskingFunctions.DEFAULT_ACCOUNT_IDS.ALICE
        );
        let bob = keyring.getPair(BobFromKeyRing.address);
        let alice = keyring.getPair(AliceFromKeyRing.address);

        console.log(`data: ${JSON.stringify(data)}`);

        switch (formType.type) {
            case constants.FORM_TYPES.CREATE_TASK.type:
                console.log(`create`);
                const unit = 1000000000000;
                return await palletTaskingFunctions.createTaskTx(
                    api,
                    alice,
                    data.taskDuration,
                    data.taskCost * unit,
                    data.taskDescription
                );
            case constants.FORM_TYPES.BID_FOR_TASK.type:
                return await palletTaskingFunctions.bidForTaskTx(
                    api,
                    bob,
                    data.taskId
                );
            case constants.FORM_TYPES.COMPLETE_TASK.type:
                return await palletTaskingFunctions.taskCompletedTx(
                    api,
                    bob,
                    data.taskId
                );

            case constants.FORM_TYPES.APPROVE_TASK.type:
                return await palletTaskingFunctions.approveTaskTx(
                    api,
                    alice,
                    data.taskId
                );
            default:
                break;
        }
    };

    useEffect(() => {
        configForForm();
    }, []);

    return (
        <>
            <Formik
                initialValues={initialValues}
                // validationSchema={!validationSchema && ""}
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
                }) => (
                    <FormikForm>
                        <Card className="text-left form p-1">
                            <Card.Body className="form-body">
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
                                    // value={values.accountId.toString()}
                                    isDisabled={values.isFieldDisabled}
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
            <span>{helperText}</span>
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
            <span>{helperText}</span>
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
                <option value="" selected disabled>
                    Select
                </option>
                {options.map((option, index) => (
                    <option key={index}>{option}</option>
                ))}
            </Form.Control>
            <span>{helperText}</span>
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
