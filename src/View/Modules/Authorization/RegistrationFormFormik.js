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
import { useDispatch } from "react-redux";
import FormErrorMessage from "./FormErrorMessage";
import * as constants from "./constants";
import { userSignUp } from "./actionCreators";
import "./RegistrationFormFormik.css"

let initialValues = {
    firstName: "",
    lastName: "",
    userType: "",
    emailId: "",
    password: "",
    confirm: "",
};

const validationSchema = Yup.object({
    firstName: Yup.string()
        .min(3, "Minimum 3 characters required!")
        .matches(/^[A-Za-z]+$/, "Cannot contain numbers!")
        .required("Required!"),
    lastName: Yup.string()
        .min(3, "Minimum 3 characters required!")
        .matches(/^[A-Za-z]+$/, "Cannot contain numbers!")
        .required("Required!"),
    userType: Yup.mixed().oneOf([
        constants.USERTYPE.CUSTOMER,
        constants.USERTYPE.WORKER,
    ]),
    emailId: Yup.string().email("Invalid email format").required("Required!"),
    password: Yup.string()
        .min(6, "Minimum 6 characters required!")
        .required("Required!"),
    confirm: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords do not match")
        .required("Required!"),
});


const FixedCardHeight = {
    height: "600px",
}

const DivHeight = {
    height: "100px"
}

const RegistrationFormFormik = () => {
    const dispatch = useDispatch();

    const handleFormSubmit = async (data) => {
        let signUpFormData = new FormData();
        signUpFormData.append("first_name", data.firstName);
        signUpFormData.append("last_name", data.lastName);
        signUpFormData.append("user_type", data.userType);
        signUpFormData.append("email_id", data.emailId);
        signUpFormData.append("password", data.password);
        dispatch(userSignUp(signUpFormData));
    };
    
    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (data, { setSubmitting, resetForm }) => {
                    setSubmitting(true);
                    handleFormSubmit(data);
                    setSubmitting(false);
                    resetForm();
                }}
            >
                {({
                    values,
                    errors,
                    isSubmitting,
                    resetForm,
                    handleForm,
                    handleSubmit,
                }) => (
                    <FormikForm>
                        <Card style={{...FixedCardHeight}}>
                            <Card.Body className="reg-form">
                                <FormLabelAndInput
                                    placeholder="first name"
                                    name="firstName"
                                    type="text"
                                    label="First Name"
                                    helperText={""}
                                    isDisabled={false}
                                />
                                <FormLabelAndInput
                                    placeholder="last name"
                                    name="lastName"
                                    type="text"
                                    label="Last Name"
                                    helperText={""}
                                    isDisabled={false}
                                />
                                <FormLabelAndDropDown
                                    label="User Type"
                                    name="userType"
                                    helperText={
                                        "Customer to posts tasks, Worker to get tasks"
                                    }
                                    options={[
                                        constants.USERTYPE.CUSTOMER,
                                        constants.USERTYPE.WORKER,
                                    ]}
                                />
                                <FormLabelAndInput
                                    placeholder="emailId"
                                    name="emailId"
                                    type="email"
                                    label="Email Id"
                                    helperText={""}
                                    isDisabled={false}
                                />
                                <div className="d-flex justify-content-between">
                                    <FormLabelAndInput
                                        placeholder="password"
                                        name="password"
                                        type="password"
                                        label="Password"
                                        helperText={"Min 6 characters"}
                                        isDisabled={false}
                                    />
                                    <FormLabelAndInput
                                        placeholder="confirm password"
                                        name="confirm"
                                        type="password"
                                        label="Confirm"
                                        helperText={""}
                                    />
                                </div>
                            </Card.Body>
                            <Card.Footer 
                                className="d-flex justify-content-between align-items-center"
                            >
                                <Button variant="warning" onClick={resetForm}>
                                    <b>Reset</b>
                                </Button>
                                <Button
                                    variant="dark"
                                    type="submit"
                                    name={`Sign Up`}
                                >
                                    <b>{`Sign Up`}</b>
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
        <Form.Group style={{...DivHeight}}>
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
            <small>{helperText}</small>
        </Form.Group>
    );
};

const FormLabelAndDropDown = ({ label, helperText, options, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <Form.Group style={{...DivHeight}}>
            <Form.Label className="publish-form-label mtl-5">
                {label}
            </Form.Label>
            <ErrorMessage
                name={field.name}
                component={FormErrorMessage}
            ></ErrorMessage>
            <Form.Control as="select" {...field} {...props}>
                <option>
                    Select
                </option>
                {options.map((option, index) => (
                    <option key={index}>{option}</option>
                ))}
            </Form.Control>
            <small>{helperText}</small>
        </Form.Group>
    );
};

export default RegistrationFormFormik;
