import React, { useState, useEffect } from "react";
import {
    Card,
    Form,
    FormControl,
    Button
} from 'react-bootstrap';
import Select from 'react-select';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from 'axios';

import apiHelpers from '../../../Utilities/axiosHelpers';
import { mergeScan } from "rxjs";

toast.configure();

const MilestoneForm = (props) => {
    const tags = props.tags;
    const title = props.title;
    const setShowModel = props.setShowModel;
    const index = props.showModel.index;
    const project = props.project;
    const setProject = props.setProject;

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
            tempMilestone.publisherAttachments[0] = event.target.value;
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

    const onFormSubmit = (event) => {
        event.preventDefault();
        const tempErrors = validateForm();
        if(Object.keys(tempErrors).length > 0 ) {
            setErrors(tempErrors);
        }else{
            if(index === -1) {
                const tempProject = {...project};
                tempProject.milestones.push(milestone);
                setProject(tempProject);
            }else{
                const tempProject = {...project};
                tempProject.milestones[index] = milestone;
                setProject(tempProject);
            }
            setShowModel({
                show:false,
                index: -1
            });
        }
    }

    const onFormDelete = () => {
        const tempProject = {...project};
        const milestoneLength = tempProject.milestones.length;
        for(let i=index; i<milestoneLength - 1; i++){
            tempProject.milestones[i] = tempProject.milestones[i+1];
        }
        tempProject.milestones.pop();
        setProject(tempProject);
        setShowModel({
            show: false,
            index: -1
        });
    }

    const onFileUpload = async (event) => {
        event.preventDefault();
        let headerObj = {
            headers:  {
                "Content-Type": "multipart/form-data"
            }
        }
        const url = 'http://localhost:8001/upload-file/'
        let res = await apiHelpers.postWithHeaders(url, file, headerObj);
        console.log(res);
        try{
            if(res.status === 202 || res.status === 200) {
                console.log('result is accepted');
                const tempMilestone = {...milestone};
                tempMilestone.publisherAttachments[0] = res.data.message;
                setMilestone(tempMilestone);
                console.log(milestone);
            }else {
                setErrors({
                    ...errors,
                    ['publisherAttachments']: res.data.message
                });
            }
        }catch(e) {
            setErrors({
                ...errors,
                ['publisherAttachments']: 'Please provide a file'
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
                                <FormControl 
                                    type="file" 
                                    size="sm"
                                    name="filesent"
                                    isInvalid={!!errors.publisherAttachments}
                                    onChange={(event) => {
                                        const formFile = new FormData();
                                        formFile.append('filesent', event.target.files[0]);
                                        setFile(formFile);
                                    }}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.publisherAttachments}
                                </Form.Control.Feedback>
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
                            value={milestone.publisherAttachments[0]}
                            disabled={true}
                            
                        />

                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-between aligin-items-center">
                        <Button
                            variant="dark"
                            type="submit"
                            onClick={onFormSubmit}
                            disabled={!valid}
                        >
                            {title}
                        </Button>
                        {
                            index !== -1 && 
                            <Button
                                variant="danger"
                                onClick={onFormDelete}
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