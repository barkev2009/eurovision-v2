import { ADMIN_ROUTE, AUTH_ROUTE, MAIN_ROUTE, REGISTER_ROUTE } from "./consts"
import AdminRoute from "./routes/AdminRoute"
import Auth from "./routes/Auth"
import Main from "./routes/Main"

export const authRoutes = [
    {
        path: MAIN_ROUTE + '/:id',
        Component: Main
    },
    {
        path: ADMIN_ROUTE,
        Component: AdminRoute
    }
]

export const publicRoutes = [
    {
        path: AUTH_ROUTE,
        Component: Auth
    },
    {
        path: REGISTER_ROUTE,
        Component: Auth
    }
]