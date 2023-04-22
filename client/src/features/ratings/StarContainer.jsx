import React, { useState } from 'react'
import StarIcon from './StarIcon';
import styles from './Star.module.css';

const StarContainer = ({ starName, initialStarValue }) => {

    const [starValue, setStarValue] = useState(initialStarValue);

    const starHandler = (e) => {
        const curValue = Math.round((e.clientX - e.target.offsetWidth / 2) / e.target.offsetWidth * 100) / 100;
        if (curValue < 0.15) {
            setStarValue(0);
        } else if (curValue > 0.85) {
            setStarValue(1);
        } else {
            setStarValue(curValue);
        }
    }

    return (
        <div className={styles.starBlock}>
            <div className={styles.starContainer}>
                <div onClick={starHandler}  className={styles.clickBox}></div>
                <StarIcon className={styles.starBack} starPerc={0} />
                <StarIcon className={styles.starFront} starPerc={(1 - starValue) * 100} />
            </div>
            <div className={styles.starParams}>
                <div className={styles.starName}>{starName}</div>
                <input type="number" value={starValue} onChange={e => setStarValue(e.target.value)} />
            </div>
        </div>
    )
}

export default StarContainer