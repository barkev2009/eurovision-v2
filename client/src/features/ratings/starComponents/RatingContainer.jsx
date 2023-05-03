import React from 'react'
import StarContainer from './StarContainer'

const RatingContainer = ({ entryData }) => {

    const ratingMapper = [
        {
            name: 'purity',
            value: 'Singing purity'
        },
        {
            name: 'show',
            value: 'Show realization'
        },
        {
            name: 'difficulty',
            value: 'Song difficulty'
        },
        {
            name: 'originality',
            value: 'Attention capture'
        },
        {
            name: 'sympathy',
            value: 'Personal sympathy'
        }
    ]

    return (
        <>
            {
                ratingMapper.map(
                    item => <StarContainer key={item.name} entryData={entryData} starName={item.value} ratingName={item.name} />
                )
            }
        </>
    )
}

export default RatingContainer