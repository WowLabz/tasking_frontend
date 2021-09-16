import React from 'react'
import { Card } from 'react-bootstrap'

const BidForTaskCard = ({tab}) => {
    return (
        <Card.Body>
            
            <small>{tab.tabType}</small>
            
        </Card.Body>
    )
}

export default BidForTaskCard
