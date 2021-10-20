import React, { useState } from "react";
import { Button, Card, Form, FormControl, Modal } from "react-bootstrap";
import {
    ErrorMessage,
    Field,
    Form as FormikForm,
    Formik,
    useField,
} from "formik";
import { useSubstrate } from "../../../substrate-lib";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import FormErrorMessage from "./FormErrorMessage";
import "./TaskFormFormik.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import {
    getAccountBalance,
    getAccountsFromKeyRing,
    transferUsingPalletTasking,
} from "../../../palletTaskingFunctions";
import { DEFAULT_ACCOUNT_IDS } from "./constants";
toast.configure();

const FixedCardHeight = {
    height: "600px",
};

const DivHeight = {
    height: "100px",
};

let initialValues = {
    accountName: "",
    accountNumber: "",
};

const validationSchema = Yup.object({
    accountName: Yup.string().required("Required!"),
    accountNumber: Yup.string().required("Required!"),
});

const CardForAirDrop = () => {
    const connectedAccounts = useSelector(
        (state) => state.headerReducer.accountsAvailableInWallet
    );
    const isWalletConnected = useSelector(
        (state) => state.headerReducer.isWalletConnected
    );
    const { api, keyring } = useSubstrate();
    const [modalShow, setModalShow] = useState(false);

    const handleFormSubmit = async (data) => {
        try {
            let AliceFromKeyRing = keyring.getAccount(
                DEFAULT_ACCOUNT_IDS.ALICE
            );
            let alice = keyring.getPair(AliceFromKeyRing.address);
            await transferUsingPalletTasking(
                api,
                alice,
                data.accountNumber,
                100 * 1000000000000
            );
        } catch (error) {
            console.log(error);
            toast.error(`Error: ${error}`, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 3000,
            });
        }
    };

    return (
        <>
            <Card
                style={{
                    borderRadius: "20px",
                    background: "#ffc107",
                    fontSize: "24px",
                    // textAlign: "center",
                    marginTop: "10px",
                }}
                className="p-3"
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-around",
                        alignItems: "center",
                        gap: "20px",
                    }}
                >
                    <div>
                        <h4 style={{ margin: "0" }}>Insufficient Balance?</h4>
                        <h4 style={{ margin: "0" }}>
                            You can request air drop to get 100 tokens for
                            testing
                        </h4>
                    </div>
                    <Button
                        variant="success"
                        onClick={() => {
                            if (isWalletConnected) {
                                setModalShow(true);
                            } else {
                                toast.error(
                                    `Please connect to a wallet provider`,
                                    {
                                        position: toast.POSITION.TOP_RIGHT,
                                        autoClose: 3000,
                                    }
                                );
                            }
                        }}
                    >
                        Air Drop
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
                            <h3>Request air drop tokens for testing</h3>
                        </Modal.Title>
                        <Modal.Title
                            onClick={() => setModalShow(false)}
                            style={{ cursor: "pointer" }}
                        >
                            &#10005;
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onSubmit={async (
                                    data,
                                    { setSubmitting, resetForm }
                                ) => {
                                    setSubmitting(true);
                                    handleFormSubmit(data);
                                    setSubmitting(false);
                                    resetForm();
                                    setModalShow(false);
                                }}
                            >
                                {({
                                    values,
                                    errors,
                                    isSubmitting,
                                    resetForm,
                                    handleForm,
                                    handleSubmit,
                                    setFieldValue,
                                }) => (
                                    <FormikForm>
                                        <Card>
                                            <Card.Title
                                                style={{ textAlign: "center" }}
                                            ></Card.Title>
                                            <Card.Body>
                                                <FormLabelAndDropDown
                                                    label="Account Name"
                                                    name="accountName"
                                                    helperText={
                                                        "Select valid account"
                                                    }
                                                    options={
                                                        connectedAccounts.length !==
                                                        0
                                                            ? [
                                                                  ...connectedAccounts,
                                                              ].map(
                                                                  (acc) =>
                                                                      acc.meta
                                                                          .name
                                                              )
                                                            : []
                                                    }
                                                    onChange={(e) => {
                                                        setFieldValue(
                                                            "accountName",
                                                            e.target.value,
                                                            false
                                                        );
                                                        let val;
                                                        [
                                                            ...connectedAccounts,
                                                        ]?.forEach((acc) => {
                                                            if (
                                                                acc.meta
                                                                    .name ===
                                                                e.target.value
                                                            ) {
                                                                val =
                                                                    acc.address;
                                                                return;
                                                            }
                                                        });
                                                        setFieldValue(
                                                            "accountNumber",
                                                            val
                                                        );
                                                    }}
                                                />
                                                <FormLabelAndInput
                                                    placeholder={`AccountId`}
                                                    name="accountNumber"
                                                    type={"text"}
                                                    label="AccountId"
                                                    helperText={""}
                                                    isDisabled={true}
                                                />
                                            </Card.Body>
                                            <Card.Footer className="d-flex justify-content-center aligin-items-center">
                                                <Button
                                                    variant="dark"
                                                    type="submit"
                                                    name={`Air Drop`}
                                                >
                                                    <b>{`Air Drop`}</b>
                                                </Button>
                                            </Card.Footer>
                                        </Card>
                                    </FormikForm>
                                )}
                            </Formik>
                        </div>
                    </Modal.Body>
                </Modal>
            </Card>
        </>
    );
};

const FormLabelAndInput = ({ label, helperText, isDisabled, ...props }) => {
    const [field, meta] = useField(props);

    return (
        <Form.Group style={{ ...DivHeight }}>
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
        <Form.Group style={{ ...DivHeight }}>
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
            <small style={{ fontSize: "12px" }}>{helperText}</small>
        </Form.Group>
    );
};

export default CardForAirDrop;
