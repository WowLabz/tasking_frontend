import React, { useState, useEffect } from "react";
import {
    Card,
    Form,
    FormControl,
    Button,
} from 'react-bootstrap';
import Select from 'react-select';
import { toast } from "react-toastify";
import { Segment, Icon, Header } from "semantic-ui-react";


import apiHelpers from '../../../Utilities/axiosHelpers';

toast.configure();

const MilestoneForm = (props) => {
    const tags = props.tags;
    const title = props.title;
    
    const index = props.showModel.index;
    const project = props.project;
    const unit = 1000000000000;
    const [milestone, setMilestone] = useState({
        name: '',
        cost: 0,
        tags: [],
        deadline: 0,
        publisherAttachments: [''] // change this later on
    });

    // if form is valid only then the submit button will be enabled
    const [valid, setValid] = useState(false);

    // for errors in form
    const [errors,setErrors] = useState({});

    //for file 
    const [file, setFile] = useState(null);

    // to show the upload spinner
    const [ showSpinner, setShowSpinner ] = useState(false);

    // to show the file name 
    const [ fileHeader, setFileHeader ] = useState("Add a file")
    

    // If the user is trying to edit the milestone then this will initialize the values
    useEffect( ()=> {
        if(index !== -1){
            const tempMilestone = {...project.milestones[index]};
            setMilestone(tempMilestone);
        }
    }, [] );

    // to validate the form
    useEffect( () => {
        if(milestone.name !== '' && milestone.cost != 0 && milestone.tags.length !== 0 && milestone.deadline != 0 && milestone.publisherAttachments != ''){
            setValid(true);
        }
    }, [milestone] );

    // validation of form elements 
    const validateForm = () => {
        const { name, cost, tags, deadline, publisherAttachments } = milestone;
        const tempErrors = {}
        if(!name || name === '') {
            tempErrors.name = 'Name cannot be empty';
        }
        if(!cost || cost <= 0) {
            tempErrors.cost = 'Cost has to be a non zero value';
        }
        if(tags.length === 0) {
            tempErrors.tags = 'Please add some tags';
        }
        if(!deadline && deadline <= 0) {
            tempErrors.deadline = 'Deadline has to be a non zero value';
        }
        if(!publisherAttachments || publisherAttachments == '') {
            tempErrors.publisherAttachments = 'Please provide some attachments';
        }
        return tempErrors;
    }

    const onValueChange = (event,value) => {
        const tempMilestone = {...milestone};
        if(value === 'tags'){
            tempMilestone.tags = event.map(obj => obj.value);
            setMilestone(tempMilestone);
            return;
        }
        if( value === 'publisherAttachments') {
            tempMilestone.publisherAttachments = event.target.value;
            setMilestone(tempMilestone);
            return;
        }
        tempMilestone[value] = event.target.value;
        setMilestone(tempMilestone);

        if(!!errors[value]){
            setErrors({
                ...errors,
                [value]: null,
            })
        }
    }

    const onFileUpload = async (event) => {
        event.preventDefault();
        if(file === null){
            setErrors({
                ...errors,
                ['publisherAttachments']: 'Please provide a file'
            })
            return;
        }
        let headerObj = {
            headers:  {
                "Content-Type": "multipart/form-data"
            }
        }
        const url = 'http://localhost:8001/upload-file/';
        let res;
        try{
            setShowSpinner(true);
            res = await apiHelpers.postWithHeaders(url, file, headerObj);
            setShowSpinner(false);
            if(res.status === 202 || res.status === 200) {
                const tempMilestone = {...milestone};
                tempMilestone.publisherAttachments = res.data.message;
                setMilestone(tempMilestone);
            }else {
                setErrors({
                    ...errors,
                    ['publisherAttachments']: res.data.message
                });
            }
        }catch(e) {
            setErrors({
                ...errors,
                ['publisherAttachments']: 'Something went wrong'
            });
        }
        
    }

    return (
        <>
            <Form>
                <Card className="text-left form p-1">
                    <Card.Body className="form-body" style={{ overflow: 'scroll'}}>
                        <Form.Label>Milestone Name</Form.Label>
                        <FormControl
                            required
                            type="text"
                            placeholder="Milestone Name" 
                            value={milestone.name}
                            onChange={(event) => onValueChange(event,'name')}
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>

                        <br />
                        <Form.Label>Cost (in units) </Form.Label>
                        <FormControl 
                            required
                            type="number"
                            placeholder="Milestone Cost"
                            value={milestone.cost > 0 ? milestone.cost : ''}
                            onChange={(event) => onValueChange(event,'cost')}
                            isInvalid={!!errors.cost}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.cost}
                        </Form.Control.Feedback>

                        <br />
                        <Form.Label>Tags</Form.Label>
                        <Select 
                            options={tags}
                            isMulti
                            placeholder="Select Tags"
                            onChange={(event) => onValueChange(event,'tags')}
                            isInvalid={!!errors.tags}
                            defaultValue={milestone.tags}
                        >
                        </Select>
                        <Form.Control.Feedback type="invalid">
                            {errors.tags}
                        </Form.Control.Feedback>

                        <br />
                        <Form.Label>Deadline (in days) </Form.Label>
                        <FormControl
                            required
                            type="number"
                            placeholder="Milestone deadline" 
                            value={milestone.deadline > 0 ? milestone.deadline : ''}
                            onChange={(event) => onValueChange(event,'deadline')}
                            isInvalid={!!errors.deadline}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.deadline}
                        </Form.Control.Feedback>

                        <br />
                        <hr />

                        <div>
                            <Form.Group className="mb-3">
                                <Form.Label>Upload File</Form.Label>
                                <br />
                                <Segment placeholder loading={showSpinner}>
                                    <Header icon>
                                        <Icon name="file pdf outline" />
                                        {fileHeader}
                                    </Header>
                                    <Button onClick={e => {
                                        {document.getElementById('imgupload').click()}
                                    }}>
                                        Add File
                                    </Button>
                                    <FormControl 
                                        type="file" 
                                        size="sm"
                                        name="filesent"
                                        id="imgupload"
                                        isInvalid={!!errors.publisherAttachments}
                                        onChange={(event) => {
                                            const formFile = new FormData();
                                            formFile.append('filesent', event.target.files[0]);
                                            setFile(formFile);
                                            setFileHeader(event.target.files[0].name)
                                        }}
                                        style={{display:'none'}}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.publisherAttachments}
                                    </Form.Control.Feedback>
                                </Segment>
                                <Button
                                    variant="warning"
                                    onClick={onFileUpload}
                                >
                                    Upload
                                </Button>
                                <br />
                                <span>
                                    <small>Note: If you have more than one file then please combine them all into one zip and then upload.</small>
                                </span>
                            </Form.Group>
                        </div>
                        <Form.Label>Publisher Attachments</Form.Label>
                        <FormControl 
                            type="text"
                            placeholder="Attachment Link"
                            value={milestone.publisherAttachments}
                            disabled={true}
                            
                        />

                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between aligin-items-center">
                        <Button
                            variant="dark"
                            type="submit"
                            onClick={(event) => {
                                event.preventDefault();
                                milestone.cost = milestone.cost * unit;
                                props.onFormSubmit(event,milestone,validateForm,setErrors,index)
                            }}
                            disabled={!valid}
                        >
                            {title}
                        </Button>
                        {
                            index !== -1 && 
                            <Button
                                variant="danger"
                                onClick={(event) => props.onFormDelete(index)}
                            >
                                Delete Milestone
                            </Button>
                        }
                    </Card.Footer>
                </Card>
            </Form>
        </>
    );
}

export default MilestoneForm;