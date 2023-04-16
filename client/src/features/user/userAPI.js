import { $authHost, $host } from ".";
import jwt_decode from 'jwt-decode';

export const register = async (name, login, password) => {
    const {data} = await $host.post('api/user/register', { name, login, password });
    localStorage.setItem(process.env.REACT_APP_LOCAL_STORAGE_KEY, data.token);
    return jwt_decode(data.token);
}

export const loginAPI = async (login, password) => {
    const {data} = await $host.post('api/user/login', { login, password });
    localStorage.setItem(process.env.REACT_APP_LOCAL_STORAGE_KEY, data.token);
    return jwt_decode(data.token);
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth');
    localStorage.setItem(process.env.REACT_APP_LOCAL_STORAGE_KEY, data.token);
    return jwt_decode(data.token);
}