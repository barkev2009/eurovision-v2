import React, { useCallback, useEffect, useState } from 'react';
import styles from './Burger.module.css';
import { $host } from '../http';
import { FIRST_SEMIFINAL, GRAND_FINAL } from '../../enum';
import { useDispatch, useSelector } from 'react-redux';
import { getRatingsByContest, sortRatings } from '../ratings/ratingsSlice';

const ORDER = 'Entry order';
const SCORE = 'Overall score';
const PLACE = 'Place in final';
const QUALIFIED = 'Qualification';
const initialSortMethods = [
    {
        name: ORDER,
        sortMethod: (a, b) => a.entryOrder - b.entryOrder
    },
    {
        name: SCORE,
        sortMethod: (a, b) => b.score - a.score
    }
]

const Filter = ({ active, setActive, trigger, setTrigger }) => {

    const [years, setYears] = useState([]);
    const [steps, setSteps] = useState([]);
    const [sortMethods, setSortMethods] = useState(initialSortMethods);

    const [curYear, setCurYear] = useState(Number(localStorage.getItem('curYear')) || 2023);
    const [curStep, setCurStep] = useState(localStorage.getItem('curStep') || FIRST_SEMIFINAL);
    const [curSort, setCurSort] = useState(localStorage.getItem('curSort') || ORDER);


    const dispatch = useDispatch();
    const ratings = useSelector(state => state.ratings.ratings);

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
    const curSortHandler = (sort) => {
        return () => {
            dispatch(
                sortRatings(
                    sortMethods.filter(item => item.name === sort)[0].sortMethod
                )
            )
            setCurSort(sort);
            setTrigger(true);
            localStorage.setItem('curSort', sort);
        }
    }

    useEffect(
        () => {
            $host.get('api/utils/get_years').then(
                resp => {
                    setYears(resp.data.map(item => item.year));
                }
            );
            $host.get('api/utils/get_steps', { params: { year: curYear } }).then(
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
    useEffect(
        () => {
            if (ratings.length !== 0) {
                dispatch(
                    sortRatings(
                        sortMethods.filter(item => item.name === curSort)[0].sortMethod
                    )
                )
            }
        }, [ratings]
    );
    useEffect(
        () => {
            setSortMethods(
                [
                    ...initialSortMethods,
                    curStep === GRAND_FINAL ?
                    {
                        name: PLACE, sortMethod: (a, b) => a.placeInFinal - b.placeInFinal
                    } :
                    {
                        name: QUALIFIED, sortMethod: (a, b) => b.qualifier - a.qualifier
                    }
                ]
            );

            if (curStep === GRAND_FINAL && curSort === QUALIFIED) {
                    setCurSort(PLACE);
                    localStorage.setItem('curSort', PLACE);
            } else if (curStep !== GRAND_FINAL && curSort === PLACE) {
                    setCurSort(QUALIFIED);
                    localStorage.setItem('curSort', QUALIFIED);
            }
        }, [curStep]
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
                <div className={styles.filter__header}>Sort by</div>
                <div className={styles.steps_container}>
                    {
                        sortMethods.map(
                            (item, idx) => <div
                                onClick={curSortHandler(item.name)}
                                key={idx}
                                style={{ borderColor: item.name === curSort ? 'yellow' : 'white' }}
                                className={styles.step_content}>
                                {item.name}
                            </div>
                        )
                    }
                </div>
                <div onClick={clickHandler} className={styles.apply_btn}>Apply</div>
            </div>
        </div>
    )
}

export default Filter