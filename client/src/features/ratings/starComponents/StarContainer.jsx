import React, { useEffect, useState } from 'react'
import StarIcon from './StarIcon';
import styles from './Star.module.css';
import { useDispatch } from 'react-redux';
import { editRating } from '../ratingsSlice';
import Arrow from '../../icons/Arrow';

const StarContainer = ({ starName, entryData, ratingName }) => {

    const [starValue, setStarValue] = useState(entryData[ratingName]);
    const dispatch = useDispatch();
    const STEP_VALUE = 0.05;

    useEffect(
        () => {
            setStarValue(entryData[ratingName]);
        }, [entryData, ratingName]
    );

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

    const checkValue = (curValue) => {
        if (curValue < 0.15) {
            setValue(0);
        } else if (curValue > 0.85) {
            setValue(1);
        } else if (curValue === 0.55) {
            setValue(0.55);
        } else {
            setValue(Math.ceil(curValue * 100 / 5) * 5 / 100);
        }
    }

    const starHandler = (e) => {
        if (document.querySelector('[class*=active]') === null) {
            const curValue = Math.round((e.clientX - e.target.offsetWidth / 2) / e.target.offsetWidth * 100) / 100;
            checkValue(curValue);
        }
    }

    const increment = () => {
        let curValue = Math.round((starValue + STEP_VALUE) * 100) / 100;
        if (curValue === 0.05 || curValue === 0.1) {
            curValue = 0.15;
        }
        checkValue(curValue);
    }

    const decrement = () => {
        let curValue = Math.round((starValue - STEP_VALUE) * 100) / 100;
        if (curValue === 0.95 || curValue === 0.9) {
            curValue = 0.85;
        }
        checkValue(curValue);
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
                <div className={styles.value_container} >
                    <Arrow action={decrement} className={styles.dec_arrow} />
                    <input className={styles.value_input} disabled type="number" value={starValue}/>
                    <Arrow action={increment} className={styles.inc_arrow} />
                </div>
            </div>
        </div>
    )
}

export default StarContainer