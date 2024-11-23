import { useState } from 'react';
import React from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signInWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const token = await userCredential.user.getIdToken();
            localStorage.setItem('token', token);
            localStorage.setItem('username', userCredential.user.email);
            console.log("Login Successfully");
            window.location.href = "/home";
            toast.success("User logged in Successfully", {
                position: "top-center",
            });
        } catch (error) {
            console.log(error);
            toast.error(error.message, {
                position: "bottom-center",
            });
        }
    };

    return (
        <div className='login-page'>
            <div className='login-container'>
                <form className='login-form' onSubmit={handleSubmit}>
                    <h1>Log In</h1>
                    <p>Welcome to MOUNT HOLYOKE COLLEGE's Rate My Housing Page</p>
                    <p>Log in to rate your dorms and see what others have to say</p>
                    <label htmlFor='login-name'>
                        Name:
                        <input type='text' id='login-name' />
                    </label>
                    <label htmlFor='login-email'>
                        Email:
                        <input type='email' id='login-email' onChange={(e) => setEmail(e.target.value)} placeholder='Enter email' />
                    </label>
                    <label htmlFor='login-password'>
                        Password:
                        <input type="password" id='login-password' onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    <button type='submit'>Log In</button><br />
                    <p>No Account? <Link to='/signup'>Sign Up</Link></p>
                </form>
            </div>
        </div>
    );
};

export default Login;