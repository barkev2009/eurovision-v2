import React, { useEffect, useState } from 'react';
import styles from './Rating.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { editPlace } from './ratingsSlice';

const PlaceInFinal = ({ placeInFinal, contestantId }) => {

    const [place, setPlace] = useState(placeInFinal);
    const [borderColor, setBorderColor] = useState('gray');
    const userRole = useSelector(state => state.user.user.role);
    const dispatch = useDispatch();

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
                setBorderColor('gray');
                break;
        }
    }

    useEffect(
        () => { 
            borderColorHandler(placeInFinal)
        }, [placeInFinal]
    );

    const placeHandler = (e) => {
        if (userRole === 'ADMIN') {
            setPlace(e.target.value);
            dispatch(
                editPlace(
                    {
                        id: contestantId,
                        place_in_final: Number(e.target.value)
                    }
                )
            );
            borderColorHandler(Number(e.target.value));
        }
    }

    return (
        <div className={styles.placeInFinal} style={{borderColor}}>
            <input className={styles.placeValue} type="number" value={place} onChange={placeHandler} />
            <div>place</div>
        </div>
    )
}

export default PlaceInFinal