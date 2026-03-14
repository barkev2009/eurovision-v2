import React, { useEffect, useState } from 'react';
import styles from './Rating.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { editPlace, editPlaceLocal, transfer } from './ratingsSlice';
import io from 'socket.io-client';
import Arrow from '../icons/Arrow';

const socket = io.connect(process.env.REACT_APP_API_URL, {
    secure: true,
    transports: ['websocket'],
    rejectUnauthorized: false 
});

const PlaceInFinal = ({ placeInFinal, contestantId, ratingId }) => {

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

    useEffect(
        () => {
            const handler = ({ id, place_in_final }) => {
                if (contestantId === id) {
                    dispatch(editPlaceLocal({ id, place_in_final }));
                }
            };
            socket.on('receiveEditPlace', handler);
            return () => {
                socket.off('receiveEditPlace', handler);
            };
        }, [contestantId, dispatch]
    );

    const transferHandler = () => {
        dispatch(
            transfer(
                {
                    id: ratingId
                }
            )
        )
    }

    const incrementStart = () => {
        const place_in_final = placeInFinal + 1;
        dispatch(
            editPlace(
                {
                    id: contestantId,
                    place_in_final
                }
            )
        );
        socket.emit(
            'sendEditPlace', {
            id: contestantId,
            place_in_final
        }
        );
    }
    const decrementStart = () => {
        const place_in_final = placeInFinal - 1;
        dispatch(
            editPlace(
                {
                    id: contestantId,
                    place_in_final
                }
            )
        );
        socket.emit(
            'sendEditPlace', {
            id: contestantId,
            place_in_final
        }
        );
    }

    const style = {
        borderColor,
        paddingLeft: userRole === 'ADMIN' ? '5vw' : '10vw',
        paddingRight: userRole === 'ADMIN' ? '15vw' : '10vw',
    }

    return (
        <div>
            <div className={styles.placeInFinal} style={style}>
                <input className={styles.placeValue} type="number" value={placeInFinal} disabled/>
                <div>place</div>
                {userRole === 'ADMIN' && <Arrow className={styles.incArrow} action={incrementStart} />}
                {userRole ==='ADMIN' && <Arrow className={styles.decArrow} action={decrementStart} />}
            </div>
            <div className={styles.transferBtn} onClick={transferHandler}>Transfer</div>
        </div>

    )
}

export default PlaceInFinal