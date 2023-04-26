import React from 'react';
import styles from './Burger.module.css';

const Burger = ({ header, items, active, setActive }) => {

    return (
        <div className={active ? `${styles.menu} ${styles.active}` : styles.menu}>
            <div onClick={() => setActive(!active)} className={styles.blur}></div>
            <div className={styles.menu__content}>
                <div className={styles.menu__header}>{header}</div>
                <ul>
                    {
                        items && items.map(
                            item => <li key={item.name} onClick={() => setActive(!active)}>
                                <img src={item.icon} alt={item.name} />
                                <a href={item.href}>{item.name}</a>
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    )
}

export default Burger