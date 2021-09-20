import React from 'react'
import { Card } from 'react-bootstrap'

const CreateTaskCard = ({tab}) => {
    return (
        <Card.Body>
            <div className='d-flex flex-column justify-content-start align-items-start'>
                <ul>
                    <li>
                        {tab.tabType}
                    </li>
                </ul>

            </div>
        </Card.Body>
    )
}

export default CreateTaskCard
