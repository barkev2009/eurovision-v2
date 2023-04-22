import React, { useState } from 'react';
import styles from './Header.module.css';
import MainLogo from './logos/MainLogo';
import useDocumentScrollThrottled from './HeaderHooks';
import FilterLogo from './logos/FilterLogo';
import AdminLogo from './logos/AdminLogo';
import {useSelector} from 'react-redux';

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

    return (
        <header className={`${shadowStyle} ${hiddenStyle}`}>
            <MainLogo className={styles.mainLogo} />
            <div className={styles.headerBtnContainer}>
                <FilterLogo className={styles.filterLogo} />
                {isAdmin && <AdminLogo className={styles.adminLogo} />}
            </div>
        </header>
    )
}

export default Header