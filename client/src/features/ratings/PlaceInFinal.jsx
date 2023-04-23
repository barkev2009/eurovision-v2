import React, { useEffect, useState } from 'react';
import styles from './Rating.module.css';

const PlaceInFinal = ({ placeInFinal }) => {

    const [place, setPlace] = useState(placeInFinal);
    const [borderColor, setBorderColor] = useState('white');

    const borderColorHandler = (place) => {
        switch (place) {
            case 1:
                setBorderColor('gold');
                break;
            case 2:
                setBorderColor('silver');
                break;
            case 3:
                setBorderColor('orange');
                break;
            default:
                setBorderColor('white');
                break;
        }
    }

    useEffect(
        () => { 
            borderColorHandler(placeInFinal)
        }, []
    );

    const placeHandler = (e) => {
        setPlace(e.target.value);
        borderColorHandler(Number(e.target.value))
    }

    return (
        <div className={styles.placeInFinal} style={{borderColor}}>
            <input className={styles.placeValue} type="number" value={place} onChange={placeHandler} />
            <div>place</div>
        </div>
    )
}

export default PlaceInFinal