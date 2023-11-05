import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom';
import { authRoutes, publicRoutes } from '../routes';
import { AUTH_ROUTE } from '../consts';

const AppRouter = () => {

    const isAuth = useSelector(state => state.user.isAuth);

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
            <Route exact path='/' element={<Navigate to={AUTH_ROUTE} />} />
        </Routes>
    )
}

export default AppRouter