import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import { useDispatch } from 'react-redux';
import { search } from '../ratings/ratingsSlice';

const Search = ({ setTrigger, trigger }) => {

    const [q, setQ] = useState('');
    const dispatch = useDispatch();

    useEffect(
        () => {
            if (trigger) {
                setQ('');
            }
        }, [trigger]
    );

    const searchHandler = (e) => {
        setQ(e.target.value);
        if (e.target.value !== '') {
            setTimeout(
                () => {
                    document
                        .querySelector('[class*=Rating_entryContainer]')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100
            );
            setTrigger(false);
            dispatch(
                search({ q: e.target.value })
            )
        } else {
            setTrigger(true);
        }
    }

    return (
        <div className={styles.search}>
            <input type="text" placeholder='Поиск' value={q} onChange={searchHandler} />
        </div>
    )
}

export default Search