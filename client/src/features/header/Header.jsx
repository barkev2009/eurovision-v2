import React, { useState } from 'react';
import styles from './Header.module.css';
import MainLogo from './MainLogo';
import useDocumentScrollThrottled from './HeaderHooks';

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

    return (
        <header className={`${shadowStyle} ${hiddenStyle}`}>
            <MainLogo className={styles.main_logo} />
        </header>
    )
}

export default Header