import React, { useCallback, useEffect, useState } from 'react';
import styles from './Burger.module.css';
import { $host } from '../http';
import { FIRST_SEMIFINAL } from '../../enum';
import { useDispatch } from 'react-redux';
import { getRatingsByContest } from '../ratings/ratingsSlice';

const Filter = ({ active, setActive, trigger, setTrigger }) => {

    const [years, setYears] = useState([]);
    const [steps, setSteps] = useState([]);

    const [curYear, setCurYear] = useState(2023);
    const [curStep, setCurStep] = useState(FIRST_SEMIFINAL);

    const dispatch = useDispatch();

    const sendRequest = useCallback(
        () => {
            if (trigger) {
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
                            year: curYear,
                            contest_step: curStep
                        }
                    )
                );
            }  
        }, [curStep, curYear, dispatch, trigger]
    );

    const clickHandler = () => {
        setActive(!active);
        setTrigger(true);
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
        }, [sendRequest]
    );
    useEffect(
        () => {
            sendRequest();
        }, [sendRequest]
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
                                onClick={() => {setCurStep(step); setTrigger(true);}}
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
                                    onClick={() => {setCurYear(Number(year)); setTrigger(true);}}
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