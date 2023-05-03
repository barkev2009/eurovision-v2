import React, { useEffect, useState } from 'react';
import styles from './Rating.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { editQualifier, editQualifierLocal } from './ratingsSlice';
import io from 'socket.io-client';

const socket = io.connect(process.env.REACT_APP_API_URL);
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
            socket.emit(
                'sendEditQualifier', {
                id: contestantId,
                qualifier: !isQualified
            }
            );
        }
    }

    useEffect(
        () => {
            socket.on(
                'receiveEditQualifier', ({ id, qualifier }) => {
                    if (contestantId === id) {
                        setIsQualified(qualifier);
                        dispatch(
                            editQualifierLocal(
                                {
                                    id,
                                    qualifier
                                }
                            )
                        )
                    }
                }
            )
        }, [socket]
    );

    return (
        <div style={{ borderColor: userRole === 'ADMIN' ? (isQualified ? '#006a00' : '#6a0000') : 'white' }} className={styles.qualifier} onClick={qualifierHandler}>{isQualified ? 'Qualified for the Final' : 'Non-qualified'}</div>
    )
}

export default Qualifier