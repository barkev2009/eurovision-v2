import React from 'react'
import { useSelector } from 'react-redux'
import EntryContainer from './EntryContainer';
import styles from './Rating.module.css';

const EntriesList = () => {

    const ratings = useSelector(state => state.ratings.ratings);

    return (
        <div className={styles.mainContainer}>
            {ratings.map(item => <EntryContainer key={item.id} entryData={item} />)}
        </div>
    )
}

export default EntriesList