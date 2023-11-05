import axios from "axios";
import { getCookie } from "../../utils/cookies";

const $host = axios.create(
    {
        baseURL: process.env.REACT_APP_API_URL
    }
)

const $authHost = axios.create(
    {
        baseURL: process.env.REACT_APP_API_URL
    }
)

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${getCookie(process.env.REACT_APP_LOCAL_STORAGE_KEY)}`
    return config
}

$authHost.interceptors.request.use(authInterceptor);

export {
    $host,
    $authHost
}