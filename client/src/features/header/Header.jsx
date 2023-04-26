import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import burgerStyles from './Burger.module.css';
import MainLogo from './logos/MainLogo';
import useDocumentScrollThrottled from './HeaderHooks';
import FilterLogo from './logos/FilterLogo';
import AdminLogo from './logos/AdminLogo';
import { useSelector } from 'react-redux';
import Burger from './Burger';

const Header = () => {

    const [shouldHideHeader, setShouldHideHeader] = useState(false);
    const [shouldShowShadow, setShouldShowShadow] = useState(false);

    const MINIMUM_SCROLL = 10;
    const TIMEOUT_DELAY = 400;

    useDocumentScrollThrottled(callbackData => {
        const { previousScrollTop, currentScrollTop } = callbackData;
        const isScrolledDown = previousScrollTop < currentScrollTop;
        const isMinimumScrolled = currentScrollTop > MINIMUM_SCROLL;

        setShouldShowShadow(currentScrollTop > 2);

        setTimeout(() => {
            setShouldHideHeader(isScrolledDown && isMinimumScrolled);
        }, TIMEOUT_DELAY);
    });

    const shadowStyle = shouldShowShadow ? styles.shadow : '';
    const hiddenStyle = shouldHideHeader ? styles.hidden : '';
    const isAdmin = useSelector(state => state.user.role === 'ADMIN');

    const [active, setActive] = useState(false);
    const ratings = useSelector(state => state.ratings.ratings);
    const [countryItems, setCountryItems] = useState([]);

    useEffect(
        () => {
            if (ratings.length !== 0) {
                setCountryItems(ratings.map(
                    rating => ({
                        name: rating.countryName,
                        icon: rating.iconPath,
                        href: '/'
                    })
                ));
            }
        }, [ratings]
    );

    return (
        <header className={`${shadowStyle} ${hiddenStyle}`}>
            <MainLogo className={styles.mainLogo} />
            <div className={styles.headerBtnContainer}>
                <FilterLogo className={styles.filterLogo} />
                {isAdmin && <AdminLogo className={styles.adminLogo} />}
                <div onClick={() => setActive(!active)} className={burgerStyles['burger-btn']}><span /></div>
                <Burger header={'Участники'} items={countryItems} active={active} setActive={setActive} />
            </div>
        </header>
    )
}

export default Header