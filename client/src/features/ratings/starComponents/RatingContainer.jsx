import React from 'react'
import StarContainer from './StarContainer'

const RatingContainer = ({ entryData }) => {

    const ratingMapper = [
        {
            name: 'purity',
            value: 'Чистота исполнения'
        },
        {
            name: 'show',
            value: 'Реализация шоу'
        },
        {
            name: 'difficulty',
            value: 'Сложность песни'
        },
        {
            name: 'originality',
            value: 'Захват внимания'
        },
        {
            name: 'sympathy',
            value: 'Личная симпатия'
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