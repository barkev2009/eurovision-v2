import React from 'react'
import { useSelector } from 'react-redux'
import EntryContainer from './EntryContainer';
import styles from './Rating.module.css';
import { useState } from 'react';

const EntriesList = () => {

    const ratings = useSelector(state => state.ratings.ratings);
    const [showOrder, setShowOrder] = useState(true);

    return (
        <div className={styles.mainContainer}>
            {ratings.map(item => <EntryContainer key={item.id} entryData={item} showOrder={showOrder} setShowOrder={setShowOrder} />)}
        </div>
    )
}

export default EntriesList