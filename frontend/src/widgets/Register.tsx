import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

import config from '../config.json'

function Register(props: {redirect: string | undefined, refreshUser: () => void}) {
    const navigate = useNavigate();
    
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    async function register(username: string, password: string) {
        const data: {login: string, password: string} = {login: username, password};
        const response = await fetch(config.BACKEND + "/register", {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "include", // include, *same-origin, omit
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "follow", // manual, *follow, error
            body: JSON.stringify(data), // body data type must match "Content-Type" header
        });
        if (response.status === 200) {
            navigate(props.redirect !== undefined ? props.redirect : '/');
            props.refreshUser();
        }
    }
    
    return (
        <>
            <h2>Register</h2>
            <p>Login: <input value={username} onChange={(e) => setUsername(e.target.value)}/></p>
            <p>Password: <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/></p>
            <p><button onClick={() => register(username, password)}>Register</button></p>
        </>
    );
}

export default Register;