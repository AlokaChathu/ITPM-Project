/* eslint-disable react-refresh/only-export-components */
import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { API_BASE } from "../config/api.js";

export const AppContent = createContext();

export const AppContextProvider = (props)=>{

    axios.defaults.withCredentials = true;

    const backendUrl = API_BASE;
    const [isLoggedin,setIsLoggedin] = useState(false);
    const [userData,setUserData] = useState(false);

    const getUserData = useCallback(async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/user/data`);
            data.success ? setUserData(data.userData): toast.error(data.message);
        } catch (error) {
            toast.error(error.message) || toast.error('Error with user data');
        }
    }, [backendUrl]);

    const getAuthState = useCallback(async () => {
        try {
            const {data} = await axios.get(`${backendUrl}/api/auth/is-auth`);
            if(data.success){
                setIsLoggedin(true);
                getUserData();
            }
        } catch (error) {
            toast.error(error.message);
        }
    }, [backendUrl, getUserData]);

    useEffect(() => {
        getAuthState();
    }, [getAuthState]);

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        userData, setUserData,
        getUserData
    }

    return (
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}