import axios, { AxiosRequestConfig } from "axios"
import { Login } from "../models/Login"
import { UserData } from "./UserFunc"

export interface Register {
    name: string,
    surname: string,
    username: string,
    password: string
}


export function jeBroj(pin: string): boolean {
    return /^\d+$/.test(pin);
}

export const registerUser = (register: Register): Promise<any> => {
    return axios.post("http://localhost:8080/api/users/register", register);
}

export const loginUser = (login: Login): Promise<UserData> => {
    const loginInf: AxiosRequestConfig = {
        auth: {
            username: String(login.username),
            password: String(login.password),
        },
    };
    return axios.post("http://localhost:8080/api/users/login", {}, loginInf).then(e => e.data);
}

