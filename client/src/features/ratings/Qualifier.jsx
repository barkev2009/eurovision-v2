import React, { useState } from 'react';
import styles from './Rating.module.css';

const Qualifier = ({ qualifier }) => {

    const [isQualified, setIsQualified] = useState(qualifier);

    const qualifierHandler = () => {
        setIsQualified(!isQualified);
    }

    return (
        <div style={{borderColor: isQualified ? '#006a00' : '#6a0000'}} className={styles.qualifier} onClick={qualifierHandler}>{isQualified ? 'Qualified for the Final' : 'Not qualified'}</div>
    )
}

export default Qualifier