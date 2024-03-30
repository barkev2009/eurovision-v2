import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import EntryContainer from './EntryContainer';
import styles from './Rating.module.css';
import modalStyles from '../../common/Modal.module.css';
import { useState } from 'react';
import Modal from '../../common/Modal';

const EntriesList = () => {

    const ratings = useSelector(state => state.ratings.ratings);
    const [showOrder, setShowOrder] = useState(true);
    const [active, setActive] = useState(false);
    const [svgPath, setSvgPath] = useState('');

    useEffect(
        () => {
            svgPath !== '' && setActive(true);
        }, [svgPath]
    );
    useEffect(
        () => {
            !active && setSvgPath('');
        }, [active]
    );

    const flagIconHandler = (svgData) => {
        return () => {
            setSvgPath(svgData);
        }
    }

    return (
        <div className={styles.mainContainer}>
            {ratings.map(item => <EntryContainer key={item.id} entryData={item} showOrder={showOrder} setShowOrder={setShowOrder} flagIconHandler={flagIconHandler} />)}
            <Modal active={active} setActive={setActive}>
                <div className={modalStyles.mcFlag} style={{backgroundImage: `url(${svgPath})`}}/>
            </Modal>
        </div>
    )
}

export default EntriesList