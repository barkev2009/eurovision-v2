import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { setCookie } from "../utils/cookies";

export const useSetCookie = () => {
    const location = useLocation();
    useEffect(
        () => {
            setCookie('curPageEuro', location.pathname);
        }, []
    );
}
