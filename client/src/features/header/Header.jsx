import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import burgerStyles from './Burger.module.css';
import MainLogo from '../icons/MainLogo';
import FilterLogo from '../icons/FilterLogo';
import AdminLogo from '../icons/AdminLogo';
import { useSelector } from 'react-redux';
import Burger from './Burger';
import Filter from './Filter';
import Search from './Search';

const Header = () => {

    const isAdmin = useSelector(state => state.user.role === 'ADMIN');

    const [active, setActive] = useState(false);
    const [filterActive, setFilterActive] = useState(false);
    const [trigger, setTrigger] = useState(true);
    const ratings = useSelector(state => state.ratings.ratings);
    const [countryItems, setCountryItems] = useState([]);

    useEffect(
        () => {
            setCountryItems(ratings.map(
                rating => ({
                    name: rating.countryName,
                    icon: rating.iconPath,
                    id: rating.id,
                    order: rating.entryOrder,
                    href: '/',
                    search: rating.search,
                    year: rating.year
                })
            ));
        }, [ratings]
    );

    return (
        <header id='header'>
            <MainLogo className={styles.mainLogo} />
            <div className={styles.headerBtnContainer}>
                <FilterLogo className={styles.filterLogo} active={filterActive} setActive={setFilterActive} />
                <Search setTrigger={setTrigger} trigger={trigger} />
                {isAdmin && <AdminLogo className={styles.adminLogo} />}
                <div onClick={() => setActive(!active)} className={burgerStyles['burger-btn']}><span /></div>
                <Burger header={'Участники'} items={countryItems} active={active} setActive={setActive} />
                <Filter active={filterActive} setActive={setFilterActive} trigger={trigger} setTrigger={setTrigger} />
            </div>
        </header>
    )
}

export default Header