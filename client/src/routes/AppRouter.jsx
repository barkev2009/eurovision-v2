import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { AUTH_ROUTE } from '../consts';
import { getCookie } from '../utils/cookies';

const AppRouter = () => {

    const isAuth = useSelector(state => state.user.isAuth);
    const navigate = useNavigate();
    const curPage = getCookie('curPageEuro');

    useEffect(
        () => {
            if (curPage) {
                navigate(curPage);
            }
        }, [isAuth]
    );

    return (
        <Routes>
            {
                isAuth && authRoutes.map(
                    ({path, Component}) => <Route key={path} path={path} Component={Component} exact />
                )
            }
            {
                publicRoutes.map(
                    ({path, Component}) => <Route key={path} path={path} Component={Component} exact />
                )
            }
            <Route exact path='*' element={<Navigate to={AUTH_ROUTE} />} />
        </Routes>
    )
}

export default AppRouter