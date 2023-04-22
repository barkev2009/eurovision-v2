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


            <StarContainer starName={'Чистота исполнения'} initialStarValue={0.3} />
            <StarContainer starName={'Наличие шоу'} initialStarValue={0.5} />
            <StarContainer starName={'Сложность песни'} initialStarValue={0.5} />
            <StarContainer starName={'Оригинальность'} initialStarValue={0.5} />
            <StarContainer starName={'Личная симпатия'} initialStarValue={0.5} />

            {/* <p>{JSON.stringify(entryData)}</p> */}
        </div>

    )
}

export default EntryContainer