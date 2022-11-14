import React, { useState, useEffect, useRef } from "react";
import { Accordion, Header, Icon, Segment, Button } from "semantic-ui-react";
import { Form, FormControl, } from "react-bootstrap";
import Select from "react-select"
import { useSelector } from "react-redux";

import { useSubstrateState } from "../../../substrate-lib";
import { MILESTONE_STATUS } from "../ProjectDetails/constants";
import { searchMilestonesTx, searchesQuery } from "../../../palletTaskingFunctions";
import ConfirmModal from "../../../Utilities/ConfirmModal";

const AdvanceSearch = (props) => {

    const { api } = useSubstrateState();
    const [ activeIndex, setActiveIndex ] = useState(-1);
    const [ searchCriteria, setSearchCriteria ] = useState({
        tags: [],
        status: null,
        minimumCost: null,
        maximumCost: null,
        minimumDeadline: null,
        maximumDeadline: null,
    });

    const [ showConfirmModal, setShowConfirmModal ] = useState({
        show: false,
        onClickHandler: null
    })

    const taskTagsForForm = useSelector(
        (state) => state.authenticationReducer.userTags
    );
    const walletUser = useSelector(state => state.headerReducer?.currentWalletDetails);
    // const walletUser = useSelector(state => state.headerReducer?.currentWalletDetails?.meta);
    // walletUser.address = useSelector(state => state.headerReducer?.currentWalletDetails?.address);
    

    // for the select options
    const tagsRef = useRef();
    const statusRef = useRef();
    

    const handleAccordionClick = (event, titleProps ) => {
        const { index } = titleProps;
        const newIndex = activeIndex === index ? -1 : index;
        setActiveIndex(newIndex);
        setSearchCriteria({
            tags: [],
            status: null,
            minimumCost: null,
            maximumCost: null,
            minimumDeadline: null,
            maximumDeadline: null,
        });
        tagsRef.current.clearValue();
        statusRef.current.clearValue();
    }

    const handleSearch = async () => {
        if(!walletUser) {
            alert("Select wallet!");
        }
        if(!walletUser.address){
            alert("Select wallet");
        }
        await searchMilestonesTx(api,walletUser.address,searchCriteria);
        setTimeout(async () => {
            const searchResults = await searchesQuery(api,walletUser.address);
            if(searchResults ) {
                props.setMilestones(searchResults);
            }
            props.setSearchActive(true);
            setActiveIndex(-1);
        },6000);
    }

    const filteredTags = taskTagsForForm.map(tag => ({value:tag, label:tag}));
    const filteredStatus = Object.keys(MILESTONE_STATUS).map(key => ({value:MILESTONE_STATUS[key], label:MILESTONE_STATUS[key]}))
    return (
        <>
            <Accordion fluid styled>
                <Accordion.Title
                    active={activeIndex===0}
                    index={0}
                    onClick={handleAccordionClick}
                >
                    <div className="d-flex align-items-center">
                        <Icon name="dropdown" />
                        <b>Search Milestones</b>
                    </div>
                </Accordion.Title>
                <Accordion.Content active={activeIndex===0}>
                    <Form>
                        <Segment>
                            <Form.Label>Tags:</Form.Label>
                            <Select
                                ref={tagsRef}
                                options={filteredTags}
                                isMulti
                                placeholder="Select Tags"
                                onChange={event => {
                                    if(event){
                                        const tempSearch = {...searchCriteria}
                                        tempSearch.tags = event.map(obj => obj.value);
                                        setSearchCriteria(tempSearch);
                                    }
                                }}
                                defaultValue={searchCriteria.tags}
                            ></Select>
                            <br />
                            <Form.Label>Status:</Form.Label>
                            <Select
                                ref={statusRef}
                                options={filteredStatus}
                                placeholder="Select Status"
                                onChange={event => {
                                    if(event){
                                        const tempSearch = {...searchCriteria}
                                        tempSearch.status = event.value;
                                        setSearchCriteria(tempSearch);
                                    }
                                }}
                            >
                            </Select>
                            <br />
                            <Form.Label>Minimum Cost:</Form.Label>
                            <FormControl 
                                type="number"
                                placeholder="Minimum cost for a milestone"
                                value={searchCriteria.minimumCost ? searchCriteria.minimumCost : ''}
                                onChange={event => {
                                    const tempSearch = {...searchCriteria}
                                    tempSearch.minimumCost = event.target.value;
                                    setSearchCriteria(tempSearch);
                                }}
                            />
                            <Form.Label>Maximum Cost:</Form.Label>
                            <FormControl 
                                type="number"
                                placeholder="Maximum cost for a milestone"
                                value={searchCriteria.maximumCost ? searchCriteria.maximumCost : ''}
                                onChange={event => {
                                    const tempSearch = {...searchCriteria}
                                    tempSearch.maximumCost = event.target.value;
                                    setSearchCriteria(tempSearch);
                                }}
                            />
                            <br />
                            <Form.Label>Minimum Deadline:</Form.Label>
                            <FormControl 
                                type="number"
                                placeholder="Minimum deadline for a milestone"
                                value={searchCriteria.minimumDeadline ? searchCriteria.minimumDeadline : ''}
                                onChange={event => {
                                    const tempSearch = {...searchCriteria}
                                    tempSearch.minimumDeadline = event.target.value;
                                    setSearchCriteria(tempSearch);
                                }}
                            />
                            <Form.Label>Maximum Deadline:</Form.Label>
                            <FormControl 
                                type="number"
                                placeholder="Minimum deadline for a milestone"
                                value={searchCriteria.maximumDeadline ? searchCriteria.maximumDeadline : ''}
                                onChange={event => {
                                    const tempSearch = {...searchCriteria}
                                    tempSearch.maximumDeadline = event.target.value;
                                    setSearchCriteria(tempSearch);
                                }}
                            />
                        </Segment>
                        <Button
                            secondary
                            floated="right"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setShowConfirmModal({
                                    show: true,
                                    onClickHandler: handleSearch
                                })
                            }}
                        >
                            Search
                        </Button>
                        <br />
                    </Form>
                </Accordion.Content>
            </Accordion>
            <ConfirmModal 
                show={showConfirmModal.show}
                onClickHandler={showConfirmModal.onClickHandler}
                handleClose={() => {
                    setShowConfirmModal({
                        show: false,
                        onClickHandler: null
                    });
                }}
            />
        </>
    );
}

export default AdvanceSearch;