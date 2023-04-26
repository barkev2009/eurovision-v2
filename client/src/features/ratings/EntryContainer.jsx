import React, { useState } from 'react';
import styles from './Rating.module.css';
import Qualifier from './Qualifier';
import PlaceInFinal from './PlaceInFinal';
import RatingContainer from './starComponents/RatingContainer';

const EntryContainer = ({ entryData }) => {

    const [showOrder, setShowOrder] = useState(true);

    const orderHandler = () => {
        setShowOrder(!showOrder);
    }

    return (
        <div className={styles.entryContainer}>
            <img src={entryData.iconPath} alt={entryData.countryName} />
            <div className={styles.countryNameWrapper}>
                <div className={styles.countryName}>{entryData.countryName}</div>
            </div>
            <div className={styles.entryParams}>
                <div className={styles.entryOrder} onClick={orderHandler}>{showOrder ? entryData.entryOrder: entryData.score.toFixed(2)}</div>
                <div className={styles.entryNames}>
                    <div className={styles.tableItemWrapper}>
                        <div className={styles.tableItem}>{entryData.artistName}</div>
                    </div>
                    <div className={styles.tableItemWrapper}>
                        <div className={styles.tableItem}>{entryData.songName}</div>
                    </div>
                </div>
            </div>

            <RatingContainer entryData={entryData} />

            {
                entryData.contestStep === 'GRAND_FINAL' ? <PlaceInFinal placeInFinal={entryData.placeInFinal} /> : <Qualifier qualifier={entryData.qualifier} />
            }
        </div>

    )
}

export default EntryContainer