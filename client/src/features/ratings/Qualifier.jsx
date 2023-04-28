import React, { useState } from 'react';
import styles from './Rating.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { editQualifier } from './ratingsSlice';

const Qualifier = ({ qualifier, contestantId }) => {

    const [isQualified, setIsQualified] = useState(qualifier);
    const userRole = useSelector(state => state.user.user.role);
    const dispatch = useDispatch();

    const qualifierHandler = () => {
        if (userRole === 'ADMIN') {
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
    }

    return (
        <div style={{ borderColor: userRole === 'ADMIN' ? (isQualified ? '#006a00' : '#6a0000') : 'white' }} className={styles.qualifier} onClick={qualifierHandler}>{isQualified ? 'Qualified for the Final' : 'Not qualified'}</div>
    )
}

export default Qualifier