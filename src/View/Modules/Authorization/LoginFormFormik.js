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
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import FormErrorMessage from "./FormErrorMessage";
import * as constants from "./constants";
import { userSignIn } from "./actionCreators";

let initialValues = {
    userName: "",
    password: "",
};

const validationSchema = Yup.object({
    userName: Yup.string().email("Invalid email format").required("Required!"),
    password: Yup.string()
        .min(6, "Minimum 6 characters required!")
        .required("Required!"),
});

const FixedCardHeight = {
    height: "600px",
};

const LoginFormFormik = () => {
    const history = useHistory();
    const isLoggedIn = useSelector(
        (state) => state.authenticationReducer.isLoggedIn
    );
    const dispatch = useDispatch();

    const handleFormSubmit = async (data) => {
        let loginFormData = new FormData();
        loginFormData.append("username", data.userName);
        loginFormData.append("password", data.password);
        dispatch(userSignIn(loginFormData));
    };

    useEffect(() => {
        if (isLoggedIn) {
            history.push("/");
        }
    }, [isLoggedIn]);

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
                        <Card style={{ ...FixedCardHeight }}>
                            <Card.Body>
                                <FormLabelAndInput
                                    placeholder="username"
                                    name="userName"
                                    type="email"
                                    label="User Name"
                                    helperText={"Enter registered EmailId"}
                                    isDisabled={false}
                                />
                                <FormLabelAndInput
                                    placeholder="password"
                                    name="password"
                                    type="password"
                                    label="Password"
                                    helperText={""}
                                    isDisabled={false}
                                />
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-center aligin-items-center">
                                <Button
                                    variant="dark"
                                    type="submit"
                                    name={`Sign In`}
                                >
                                    <b>{`Sign In`}</b>
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
            <small>{helperText}</small>
        </Form.Group>
    );
};

export default LoginFormFormik;
