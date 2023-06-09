import React, { useEffect, useRef, useState } from 'react'

const Arrow = ({ className, action, onClick }) => {

    const [fill, setFill] = useState('white');
    const [isMouseDown, setMouseDown] = useState(false);

    function useInterval(callback, delay) {
        const savedCallback = useRef();

        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }
    useInterval(action, isMouseDown && !onClick ? 300 : null);

    const mouseDownHandler = () => {
        setFill('yellow');
        setMouseDown(true);
    }
    const mouseUpHandler = () => {
        setFill('white');
        setMouseDown(false);        
    }
    const clickHandler = () => {
        action()
    }

    return (
        <div className={className} onClick={clickHandler} onTouchStart={mouseDownHandler} onTouchEnd={mouseUpHandler} onMouseDown={mouseDownHandler} onMouseUp={mouseUpHandler}>
            <svg viewBox="-4.5 0 20 20" >
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Dribbble-Light-Preview" transform="translate(-305.000000, -6679.000000)" fill={fill}>
                        <g id="icons" transform="translate(56.000000, 160.000000)">
                            <path d="M249.365851,6538.70769 L249.365851,6538.70769 C249.770764,6539.09744 250.426289,6539.09744 250.830166,6538.70769 L259.393407,6530.44413 C260.202198,6529.66364 260.202198,6528.39747 259.393407,6527.61699 L250.768031,6519.29246 C250.367261,6518.90671 249.720021,6518.90172 249.314072,6519.28247 L249.314072,6519.28247 C248.899839,6519.67121 248.894661,6520.31179 249.302681,6520.70653 L257.196934,6528.32352 C257.601847,6528.71426 257.601847,6529.34685 257.196934,6529.73759 L249.365851,6537.29462 C248.960938,6537.68437 248.960938,6538.31795 249.365851,6538.70769" id="arrow_right-[#336]">
                            </path>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    )
}

export default Arrow