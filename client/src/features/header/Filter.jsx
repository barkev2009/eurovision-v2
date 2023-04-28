import React, { useEffect, useState } from 'react';
import styles from './Burger.module.css';
import { $host } from '../http';
import { FIRST_SEMIFINAL } from '../../enum';
import { useDispatch } from 'react-redux';
import { getRatingsByContest } from '../ratings/ratingsSlice';
import { useLocation } from 'react-router-dom';

const Filter = ({ items, active, setActive }) => {

    const [years, setYears] = useState([]);
    const [steps, setSteps] = useState([]);

    const [curYear, setCurYear] = useState(2023);
    const [curStep, setCurStep] = useState(FIRST_SEMIFINAL);

    const location = useLocation();

    const dispatch = useDispatch();
    const sendRequest = () => {
        setTimeout(
            () => {
                document
                    .querySelector('[class*=Rating_entryContainer]')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100
        );
        dispatch(
            getRatingsByContest(
                {
                    userId: location.pathname.split('/')[2],
                    year: curYear,
                    contest_step: curStep
                }
            )
        );
    }

    const clickHandler = () => {
        setActive(!active);

        setTimeout(
            () => {
                document
                    .querySelector('[class*=Rating_entryContainer]')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100
        );
    }

    useEffect(
        () => {
            $host.get('api/utils/get_years').then(
                resp => {
                    setYears(resp.data.map(item => item.year));
                }
            );
            $host.get('api/utils/get_steps').then(
                resp => {
                    setSteps(resp.data.map(item => item.contest_step));
                }
            );
            sendRequest();
        }, []
    );
    useEffect(
        () => {
            sendRequest();
        }, [curYear, curStep]
    );

    return (
        <div className={active ? `${styles.menu} ${styles.active}` : styles.menu}>
            <div onClick={() => setActive(!active)} className={styles.blur}></div>
            <div className={styles.menu__content}>
                <div className={styles.filter__header}>Этапы конкурса</div>
                <div className={styles.steps_container}>
                    {
                        steps.map(
                            (step, idx) => <div
                                onClick={() => setCurStep(step)}
                                key={idx}
                                style={{ borderColor: step === curStep ? 'yellow' : 'white' }}
                                className={styles.step_content}>
                                {step}
                            </div>
                        )
                    }
                </div>
                <div className={styles.filter__header}>Годы</div>
                <div className={styles.year_wrapper}>
                    <div className={styles.years_container}>
                        {
                            years.map(
                                (year, idx) => <div
                                    key={idx}
                                    onClick={() => setCurYear(Number(year))}
                                    style={{ borderColor: Number(year) === curYear ? 'yellow' : 'white' }}
                                    className={styles.year_content}>
                                    {year}
                                </div>
                            )
                        }
                    </div>
                </div>
                <div onClick={clickHandler} className={styles.apply_btn}>Применить</div>
            </div>
        </div>
    )
}

export default Filter