import React from 'react';
import styles from './Rating.module.css';
import Qualifier from './Qualifier';
import PlaceInFinal from './PlaceInFinal';
import RatingContainer from './starComponents/RatingContainer';
import { GRAND_FINAL } from '../../enum';

const EntryContainer = ({ entryData, showOrder, setShowOrder, flagIconHandler }) => {

    const orderHandler = () => {
        setShowOrder(!showOrder);
    }

    return (
        <div id={entryData.id} className={styles.entryContainer}>
            <img src={entryData.iconPath} alt={entryData.countryName} onClick={flagIconHandler(entryData.iconPath)} />
            <div className={styles.countryNameWrapper}>
                <div className={styles.countryName}>{entryData.countryName}</div>
            </div>
            <div className={styles.entryParams}>
                <div className={styles.entryOrder} onClick={orderHandler}>{showOrder ? entryData.entryOrder : entryData.score.toFixed(2)}</div>
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
                entryData.contestStep === GRAND_FINAL ? <PlaceInFinal placeInFinal={entryData.placeInFinal} contestantId={entryData.contestantId} ratingId={entryData.id} /> : <Qualifier qualifier={entryData.qualifier} contestantId={entryData.contestantId} />
            }
        </div>

    )
}

export default EntryContainer