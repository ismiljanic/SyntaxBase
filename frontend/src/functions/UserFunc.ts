import axios, { AxiosRequestConfig } from "axios";
import { Login } from "../models/Login";
import { Register } from "./RegisterFunc";

export interface UserData {
    id: number,
    username: string,
    password: string,
    errorMessage?: string
}

export const loginUser = (login: Login): Promise<UserData> => {
    const loginPackage: AxiosRequestConfig = {
        auth: {
            username: String(login.username),
            password: String(login.password)
        }
    };
    return axios.post("http://localhost:8080/api/users/login", {}, loginPackage)
        .then(response => response.data)
        .catch(error => {
            if (error.response && error.response.status === 401) {
                throw new Error('Wrong username or password.');
            } else {
                throw new Error('An error occurred during login.');
            }
        });
}


export const registerUser = (register: Register): Promise<any> => {
    return axios.post("http://localhost:8080/api/users/register", register)
        .then(response => response.data)
        .catch((error) => {
            if (error.response) {
                console.error("Registration failed:", error.response.data);
                throw new Error(error.response.data);
            } else {
                console.error("Network error or no response.");
                throw new Error('Network error');
            }
        });
}


export const getUser = (id: string): Promise<UserData> => {
    return axios.get("http://localhost:8080/api/users/getInfo/" + id).then(e => e.data)
}