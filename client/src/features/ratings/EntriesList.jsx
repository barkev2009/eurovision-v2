import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import EntryContainer from './EntryContainer';
import styles from './Rating.module.css';
import { FIRST_SEMIFINAL, GRAND_FINAL, SECOND_SEMIFINAL } from '../../enum';
import { getRatingsByContest } from './ratingsSlice';

const EntriesList = () => {

    const ratings = useSelector(state => state.ratings.ratings);
    const dispatch = useDispatch();

    useEffect(
        () => {
            dispatch(getRatingsByContest(
                {
                    userId: '877d4152-14b4-7793-e143-1025604c2b34',
                    year: 2022,
                    contest_step: GRAND_FINAL
                }
            ))
        }, []
    );

    return (
        <div className={styles.mainContainer}>
            {ratings.map(item => <EntryContainer key={item.id} entryData={item} />)}
        </div>
    )
}

export default EntriesList