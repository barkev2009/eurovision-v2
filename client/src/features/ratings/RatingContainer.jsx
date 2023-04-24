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
            value: 'Наличие шоу'
        },
        {
            name: 'difficulty',
            value: 'Сложность песни'
        },
        {
            name: 'originality',
            value: 'Оригинальность'
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