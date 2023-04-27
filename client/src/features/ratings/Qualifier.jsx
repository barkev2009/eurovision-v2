import React, { useState } from 'react';
import styles from './Rating.module.css';
import { useDispatch } from 'react-redux';
import { editQualifier } from './ratingsSlice';

const Qualifier = ({ qualifier, contestantId }) => {

    const [isQualified, setIsQualified] = useState(qualifier);
    const dispatch = useDispatch();

    const qualifierHandler = () => {
        setIsQualified(!isQualified);
        dispatch(
            editQualifier(
                {
                    id: contestantId,
                    qualifier: !isQualified
                }
            )
        )
    }

    return (
        <div style={{borderColor: isQualified ? '#006a00' : '#6a0000'}} className={styles.qualifier} onClick={qualifierHandler}>{isQualified ? 'Qualified for the Final' : 'Not qualified'}</div>
    )
}

export default Qualifier