import React from 'react';
import styles from './Burger.module.css';

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
                                    <a onClick={clickHandler(item.id)} href={item.href}>{`${item.search ? '' : item.order + '.'} ${item.name}`}</a>
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