import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import AppHeader from "../../../Components/AppHeader/AppHeader";
import { useSubstrate } from "../../../substrate-lib";
import TestingSubstrateLib from "../../../TestingSubstrateLib";
import * as palletTaskingFunctions from "../../../palletTaskingFunctions";
import * as actionCreators from "./actionCreators";
import "./Dashboard.css";
import TaskCard from "./TaskCard";
import TaskFormFormik from "./TaskFormFormik";
import * as constants from "./constants";
import staticData from "../../../assets/staticData/staticData.json";
import "react-toastify/dist/ReactToastify.min.css";
import AppFooter from "../../../Components/AppFooter/AppFooter";

toast.configure();

const DashBoard = (props) => {
    const { api, keyring } = useSubstrate();
    const dispatch = useDispatch();

    const tasks = useSelector((state) => state.dashBoardReducer.tasks);

    const [show, setShow] = useState(false);
    const [currentFormTypeAndData, setCurrentFormTypeAndData] = useState({
        formType: constants.FORM_TYPES.CREATE_TASK,
        data: "",
    });

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const init = async () => {
            try {
                palletTaskingFunctions.handleOnChainEvents(api, toast);
                const getTasksResult = await palletTaskingFunctions.getAllTasks(
                    api
                );
                if (getTasksResult) {
                    console.log(
                        `All Tasks From Chain: ${getTasksResult.length}`
                    );
                    dispatch(
                        actionCreators.setTasksFromBackEnd([
                            ...getTasksResult.sort(
                                (a, b) => b.task_id - a.task_id
                            ),
                        ])
                    );
                }
            } catch (error) {
                console.log(`catchError at useEffect : ${error}`);
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
                : "Form";

        setCurrentFormTypeAndData({
            formType: { type: formTypeOnClick, title },
            data: data,
        });
        handleShow();
    };

    return (
        <>
            <AppHeader />
            <Container
                className="dashboard-container"
                style={{ marginTop: "50px", marginBottom: "30px" }}
            >
                <Row className="p-4">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 style={{ margin: "0" }}>Marketplace</h2>
                        <Button
                            name={constants.FORM_TYPES.CREATE_TASK.type}
                            onClick={(e) => showFormModal(e, null)}
                        >
                            Create New Task
                        </Button>
                    </div>
                    <Card
                        style={{
                            borderRadius: "20px",
                            background: "#ffc107",
                            fontSize: "24px",
                            textAlign: "center",
                            marginTop: "10px",
                        }}
                        className="p-3"
                    >
                        <h4>
                            Please visit{" "}
                            <a
                                href={constants.DOT_MARKETPLACE}
                                target="_blank"
                                style={{ color: "red" }}
                            >
                                Dot Marketplace
                            </a>{" "}
                            our updated App
                        </h4>
                    </Card>
                </Row>

                <Row>
                    {!tasks.length && (
                        <span style={{ marginLeft: "45px" }} className="p-2">
                            Showing Demo Data, You can create a new Task!
                        </span>
                    )}
                    {tasks.length
                        ? tasks.map((task, index) => (
                              <TaskCard
                                  data={task}
                                  showFormModal={showFormModal}
                              />
                          ))
                        : staticData.data.map((task, index) => (
                              <TaskCard
                                  data={task}
                                  showFormModal={showFormModal}
                              />
                          ))}
                </Row>
                <TaskModal
                    show={show}
                    handleClose={handleClose}
                    configForBackEnd={{ api, keyring }}
                    formTypeAndData={currentFormTypeAndData}
                />
            </Container>
            <AppFooter />
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
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>
                    <b>{title}</b>
                </Modal.Title>
                <Modal.Title
                    onClick={handleClose}
                    style={{ cursor: "pointer" }}
                >
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
    );
};

export default DashBoard;
