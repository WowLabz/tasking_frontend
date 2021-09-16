import React from 'react'
import { Card } from 'react-bootstrap'

const TaskDescriptionCard = ({tab}) => {
    return (
        <Card.Body>
            <small>{tab.tabType}</small>
        </Card.Body>
    )
}

export default TaskDescriptionCard
