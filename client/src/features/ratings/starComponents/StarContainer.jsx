import React, { useState } from 'react'
import StarIcon from './StarIcon';
import styles from './Star.module.css';
import { useDispatch } from 'react-redux';
import { editRating } from '../ratingsSlice';

const StarContainer = ({ starName, entryData, ratingName }) => {

    const [starValue, setStarValue] = useState(entryData[ratingName]);
    const dispatch = useDispatch();

    const setValue = (value) => {
        setStarValue(value);
        dispatch(
            editRating(
                {
                    id: entryData.id,
                    [ratingName]: value
                }
            )
        )
    }

    const starHandler = (e) => {
        if (document.querySelector('[class*=active]') === null) {
            const curValue = Math.round((e.clientX - e.target.offsetWidth / 2) / e.target.offsetWidth * 100) / 100;
            if (curValue < 0.15) {
                setValue(0);

            } else if (curValue > 0.85) {
                setValue(1);
            } else {
                setValue(Math.ceil(curValue * 100 / 5) * 5 / 100);
            }
        }
    }

    const inputHandler = (e) => {
        const curValue = Number(e.target.value);
        if (curValue < 0.15) {
            setValue(0);
        } else if (curValue > 0.85) {
            setValue(1);
        } else {
            setValue(Math.ceil(curValue * 100 / 5) * 5 / 100);
        }
    }

    return (
        <div className={styles.starBlock}>
            <div className={styles.starContainer}>
                <div onClick={starHandler} className={styles.clickBox}></div>
                <StarIcon className={styles.starBack} starPerc={0} />
                <StarIcon className={styles.starFront} starPerc={(1 - starValue) * 100} />
            </div>
            <div className={styles.starParams}>
                <div className={styles.starName}>{starName}</div>
                <input type="number" value={starValue} onChange={inputHandler} />
            </div>
        </div>
    )
}

export default StarContainer