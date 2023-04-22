import React from 'react';
import styles from './Rating.module.css';
import StarContainer from './StarContainer';

const EntryContainer = ({ entryData }) => {
    return (
        <div className={styles.entryContainer}>
            <img src={entryData.iconPath} />
            <div className={styles.countryNameWrapper}>
                <div className={styles.countryName}>{entryData.countryName}</div>
            </div>

            <div className={styles.tableItemWrapper}>
                <div className={styles.tableItem}>{entryData.artistName}</div>
            </div>
            <div className={styles.tableItemWrapper}>
                <div className={styles.tableItem}>{entryData.songName}</div>
            </div>


            <StarContainer starName={'Чистота исполнения'} starValue={0.5} />
            <StarContainer starName={'Наличие шоу'} starValue={0.5} />
            <StarContainer starName={'Сложность песни'} starValue={0.5} />
            <StarContainer starName={'Оригинальность'} starValue={0.5} />
            <StarContainer starName={'Личная симпатия'} starValue={0.5} />

            {/* <p>{JSON.stringify(entryData)}</p> */}
        </div>

    )
}

export default EntryContainer