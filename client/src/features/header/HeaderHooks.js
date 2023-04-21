import { useState, useEffect } from "react";
import { throttle } from 'lodash';

const useDocumentScrollThrottled = (callback) => {
    const [, setScrollPosition] = useState(0);

    let previousScrollTop = 0;

    const handleDocumentScroll = () => {
        const { scrollTop: currentScrollTop } = document.documentElement || document.body;
        console.log(`%c${currentScrollTop}`, {"color": "reduce", "font-size": "15px"})

        setScrollPosition(
            prev => {
                previousScrollTop = prev;
                return currentScrollTop
            }
        );

        callback({ previousScrollTop, currentScrollTop });
    }

    const handleDocumentScrollThrottled = throttle(handleDocumentScroll, 250);

    useEffect(
        () => {
            window.addEventListener('scroll', handleDocumentScrollThrottled);

            return () => {
                window.removeEventListener('scroll', handleDocumentScrollThrottled)
            }
        }, []
    );

}

export default useDocumentScrollThrottled;