import React from 'react';
import styles from './Burger.module.css';
import { GRAND_FINAL } from '../../enum';
import HeartLogo from './../icons/HeartLogo';

const Burger = ({ header, items, active, setActive }) => {

    const clickHandler = (id) => {
        return (e) => {
            e.preventDefault();
            document.getElementById(id).scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    return (
        <div className={active ? `${styles.menu} ${styles.active}` : styles.menu}>
            <div onClick={() => setActive(!active)} className={styles.blur}></div>
            <div className={styles.menu__content}>
                <div className={styles.menu__header}>{header}</div>
                <div className={styles.menu__content_wrapper}>
                    <ul>
                        {
                            items && items.map(
                                (item, idx) => <li key={idx} onClick={() => setActive(!active)}>
                                    <img src={item.icon} alt={item.name} />
                                    <div className={styles.burger_item_txt}>
                                        <a onClick={clickHandler(item.id)} href={item.href}>
                                            {`${item.search ? '' : item.order + '.'} ${item.name} ${item.search ? `(${item.year})` : ''}`}

                                        </a>
                                        {item.step !== GRAND_FINAL && item.qualifier && <HeartLogo className={styles.heart_burger} fill={'rgb(0, 106, 0)'} />}
                                        {item.step === GRAND_FINAL && item.place !== 0 && <span>{`(${item.place} place)`}</span>}
                                    </div>
                                </li>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Burger