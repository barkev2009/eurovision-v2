import React, { useCallback, useEffect, useState } from 'react';
import styles from './Burger.module.css';
import { $host } from '../http';
import { FIRST_SEMIFINAL } from '../../enum';
import { useDispatch } from 'react-redux';
import { getRatingsByContest } from '../ratings/ratingsSlice';

const Filter = ({ active, setActive, trigger, setTrigger }) => {

    const [years, setYears] = useState([]);
    const [steps, setSteps] = useState([]);

    const [curYear, setCurYear] = useState(Number(localStorage.getItem('curYear')) || 2023);
    const [curStep, setCurStep] = useState(localStorage.getItem('curStep') || FIRST_SEMIFINAL);

    const dispatch = useDispatch();

    const sendRequest = useCallback(
        () => {
            if (trigger) {
                setTimeout(
                    () => {
                        document
                            .querySelector('[class*=Rating_entryContainer]')
                            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 500
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
            }, 500
        );
    }
    const curYearHandler = (year) => {
        return () => {
            setTrigger(true);
            setCurYear(year);
            localStorage.setItem('curYear', year);
        }
    }
    const curStepHandler = (step) => {
        return () => {
            setCurStep(step); 
            setTrigger(true); 
            localStorage.setItem('curStep', step)
        }
    }

    useEffect(
        () => {
            $host.get('api/utils/get_years').then(
                resp => {
                    setYears(resp.data.map(item => item.year));
                }
            );
            $host.get('api/utils/get_steps', {params: {year: curYear}}).then(
                resp => {
                    setSteps(resp.data.map(item => item.contest_step));
                }
            );
            sendRequest();
        }, [sendRequest, curYear]
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
                <div className={styles.filter__header}>Contest steps</div>
                <div className={styles.steps_container}>
                    {
                        steps.map(
                            (step, idx) => <div
                                onClick={curStepHandler(step)}
                                key={idx}
                                style={{ borderColor: step === curStep ? 'yellow' : 'white' }}
                                className={styles.step_content}>
                                {step}
                            </div>
                        )
                    }
                </div>
                <div className={styles.filter__header}>Years</div>
                <div className={styles.year_wrapper}>
                    <div className={styles.years_container}>
                        {
                            years.map(
                                (year, idx) => <div
                                    key={idx}
                                    onClick={curYearHandler(Number(year))}
                                    style={{ borderColor: Number(year) === curYear ? 'yellow' : 'white' }}
                                    className={styles.year_content}>
                                    {year}
                                </div>
                            )
                        }
                    </div>
                </div>
                <div onClick={clickHandler} className={styles.apply_btn}>Apply</div>
            </div>
        </div>
    )
}

export default Filter