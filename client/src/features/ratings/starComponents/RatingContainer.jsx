import React from 'react'
import StarContainer from './StarContainer'
import styles from '../Rating.module.css';

const RatingContainer = ({ entryData }) => {

    const ratingMapper = [
        {
            name: 'purity',
            value: 'Vocal performance'
        },
        {
            name: 'show',
            value: 'Stage production'
        },
        {
            name: 'difficulty',
            value: 'Song composition'
        },
        {
            name: 'originality',
            value: 'Artistic integrity'
        },
        {
            name: 'sympathy',
            value: 'Personal sympathy'
        }
    ]

    return (
        <div className={styles.ratingsWrapper}>
            {
                ratingMapper.map(
                    item => <StarContainer key={item.name} entryData={entryData} starName={item.value} ratingName={item.name} />
                )
            }
        </div>
    )
}

export default RatingContainer