import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Burger.module.css';
import { $host } from '../http';
import { FIRST_SEMIFINAL, GRAND_FINAL } from '../../enum';
import { useDispatch } from 'react-redux';
import {
    getRatingsByContest,
    sortRatings,
    SORT_BY_ORDER,
    SORT_BY_SCORE,
    SORT_BY_PLACE,
    SORT_BY_QUALIFIED,
} from '../ratings/ratingsSlice';
import { getCookie, setCookie } from '../../utils/cookies';

const SORT_LABELS = {
    [SORT_BY_ORDER]:     'Entry order',
    [SORT_BY_SCORE]:     'Overall score',
    [SORT_BY_PLACE]:     'Place in final',
    [SORT_BY_QUALIFIED]: 'Qualified',
};

const baseSortKeys = [SORT_BY_ORDER, SORT_BY_SCORE];

const Filter = ({ active, setActive, trigger, setTrigger }) => {

    const [years, setYears] = useState([]);
    const [steps, setSteps] = useState([]);
    const [sortKeys, setSortKeys] = useState(baseSortKeys);

    const [curYear, setCurYear] = useState(Number(getCookie('curYear')) || null);
    const [curStep, setCurStep] = useState(getCookie('curStep') || FIRST_SEMIFINAL);
    const [curSort, setCurSort] = useState(getCookie('curSort') || SORT_BY_ORDER);

    const dispatch = useDispatch();

    // Рефы для актуальных значений без пересоздания колбэков
    const stateRef = useRef({ trigger, curYear, curStep });
    const sortRef = useRef(curSort);
    useEffect(() => {
        stateRef.current = { trigger, curYear, curStep };
        sortRef.current = curSort;
    });

    const sendRequest = useCallback(
        () => {
            const { trigger, curYear, curStep } = stateRef.current;
            if (trigger && curYear) {
                setTimeout(() => {
                    document
                        .querySelector('[class*=Rating_entryContainer]')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 500);
                // Сортировка применяется через .then() после загрузки —
                // это разрывает цикл useEffect([ratings]) → sort → новый массив → useEffect → ...
                dispatch(getRatingsByContest({ year: curYear, contest_step: curStep }))
                    .then(() => dispatch(sortRatings(sortRef.current)));
            }
        },
        [dispatch]
    );

    const clickHandler = () => {
        setActive(!active);
        setTrigger(true);
        setTimeout(() => {
            document
                .querySelector('[class*=Rating_entryContainer]')
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    }

    const curYearHandler = (year) => () => {
        setTrigger(true);
        setCurYear(year);
        setCookie('curYear', year);
    }

    const curStepHandler = (step) => () => {
        setCurStep(step);
        setTrigger(true);
        setCookie('curStep', step);
    }

    const curSortHandler = (sortKey) => () => {
        dispatch(sortRatings(sortKey));
        setCurSort(sortKey);
        setCookie('curSort', sortKey);
    }

    // Загружаем список лет один раз при маунте
    useEffect(
        () => {
            $host.get('api/utils/get_years').then(resp => {
                const fetchedYears = resp.data.map(item => item.year);
                setYears(fetchedYears);
                if (!getCookie('curYear') && fetchedYears.length > 0) {
                    const maxYear = Math.max(...fetchedYears.map(Number));
                    setCurYear(maxYear);
                    setCookie('curYear', maxYear);
                }
            });
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    );

    // Загружаем шаги при смене года
    useEffect(
        () => {
            if (!curYear) return;
            $host.get('api/utils/get_steps', { params: { year: curYear } }).then(
                resp => setSteps(resp.data.map(item => item.contest_step))
            );
        },
        [curYear]
    );

    // Делаем запрос при изменении года, шага или trigger
    useEffect(
        () => {
            sendRequest();
        },
        [curYear, curStep, trigger, sendRequest]
    );

    // Переключаем доступные варианты сортировки при смене шага
    useEffect(
        () => {
            const extra = curStep === GRAND_FINAL ? SORT_BY_PLACE : SORT_BY_QUALIFIED;
            setSortKeys([...baseSortKeys, extra]);

            if (curStep === GRAND_FINAL && curSort === SORT_BY_QUALIFIED) {
                setCurSort(SORT_BY_PLACE);
                setCookie('curSort', SORT_BY_PLACE);
            } else if (curStep !== GRAND_FINAL && curSort === SORT_BY_PLACE) {
                setCurSort(SORT_BY_QUALIFIED);
                setCookie('curSort', SORT_BY_QUALIFIED);
            }
        },
        [curStep] // eslint-disable-line react-hooks/exhaustive-deps
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
                        sortKeys.map(
                            (key, idx) => <div
                                onClick={curSortHandler(key)}
                                key={idx}
                                style={{ borderColor: key === curSort ? 'yellow' : 'white' }}
                                className={styles.step_content}>
                                {SORT_LABELS[key]}
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