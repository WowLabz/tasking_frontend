import React, { useState, useEffect } from "react";
import { Modal, Card, Form, FormControl, Button } from "react-bootstrap";
import { Segment, Icon, Header } from "semantic-ui-react";

import apiHelpers from "../../../Utilities/axiosHelpers";
import { milestoneCompletedTx } from "../../../palletTaskingFunctions";

const CompleteMilestone = (props) => {
  const show = props.show;
  const setShow = props.setShow;
  const milestone = props.milestone;
  const api = props.api;
  const walletUser = props.walletUser;

  const [file, setFile] = useState(null);
  const [workerAttachments, setWorkerAttachments] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [uploadButton, setUploadButton] = useState(true);
  const [valid, setValid] = useState(false);

  // to show the file name
  const [fileHeader, setFileHeader] = useState("Add a file");

  useEffect(() => {
    if (workerAttachments.length > 0) {
      setValid(true);
    }
  }, [workerAttachments]);

  const onFileUpload = async (event) => {
    event.preventDefault();
    let headerObj = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const url = process.env.REACT_APP_FILE_SERVER + "/upload-file/";
    let res;
    try {
      setSpinner(true);
      res = await apiHelpers.postWithHeaders(url, file, headerObj);
      setSpinner(false);
      if (res.status === 202 || res.status === 200) {
        setWorkerAttachments(res.data.message);
      } else {
        setUploadButton(true);
      }
    } catch (e) {
      setUploadButton(true);
    }
  };

  const handleSubmit = async () => {
    await milestoneCompletedTx(
      api,
      walletUser.address,
      milestone.milestoneId,
      workerAttachments
    );
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header>
        <Modal.Title>Complete Milestone</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Card className="text-left form p-1">
            <Card.Body className="form-body" style={{ overflow: "scroll" }}>
              <div>
                <Form.Group className="mb-3">
                  <Form.Label>Upload File</Form.Label>
                  <br />
                  <Segment
                    placeholder
                    loading={spinner}
                    style={{ cursor: "default" }}
                  >
                    <Header icon>
                      <Icon name="file pdf outline" />
                      {fileHeader}
                    </Header>
                    <Button
                      onClick={(e) => {
                        document.getElementById("imgupload").click();
                      }}
                    >
                      Add File
                    </Button>
                    <FormControl
                      type="file"
                      size="sm"
                      name="filesent"
                      id="imgupload"
                      onChange={(event) => {
                        setFileHeader(event.target.files[0].name);
                        const formFile = new FormData();
                        formFile.append("filesent", event.target.files[0]);
                        setFile(formFile);
                        setUploadButton(false);
                      }}
                      style={{ display: "none" }}
                    />
                  </Segment>
                  <Button
                    variant="warning"
                    disabled={uploadButton}
                    onClick={onFileUpload}
                  >
                    Upload
                  </Button>
                  <br />
                  <span>
                    <small>
                      Note: If you have more than one file then please combine
                      them all into one zip and then upload.
                    </small>
                  </span>
                </Form.Group>
              </div>
              <Form.Label>Worker Attachments</Form.Label>
              <FormControl
                type="text"
                placeholder="Attachment Link"
                value={workerAttachments ? workerAttachments : ""}
                disabled={true}
              />
            </Card.Body>
            <Card.Footer>
              <Button
                type="submit"
                variant="dark"
                disabled={!valid}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleSubmit();
                  setShow(false);
                }}
              >
                Submit
              </Button>
            </Card.Footer>
          </Card>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CompleteMilestone;
