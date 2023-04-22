import React from 'react'
import StarIcon from './StarIcon';
import styles from './Star.module.css';

const StarContainer = ({ starName, starValue }) => {
    return (
        <div className={styles.starBlock}>
            <div className={styles.starContainer}>
                <StarIcon className={styles.starBack} />
                <StarIcon className={styles.starFront} />
            </div>
            <div className={styles.starParams}>
                <div className={styles.starName}>{starName}</div>
                <input type="number" value={starValue} />
            </div>
        </div>
    )
}

export default StarContainer