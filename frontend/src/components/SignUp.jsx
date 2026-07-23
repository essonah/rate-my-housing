import { useState } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import './Login.css';

function SignUp() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords don't match", { position: "bottom-center" });
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            toast.success("Account created successfully", {
                position: "top-center",
            });
            navigate("/", { replace: true });
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
                    <h1>Sign Up</h1>
                    <p>Join MOUNT HOLYOKE COLLEGE's Rate My Housing Page</p>
                    <p>Create an account to rate your dorm and share your experience</p>
                    <label htmlFor='signup-email'>
                        Email:
                        <input type='email' id='signup-email' onChange={(e) => setEmail(e.target.value)} placeholder='Enter email' required />
                    </label>
                    <label htmlFor='signup-password'>
                        Password:
                        <input type="password" id='signup-password' onChange={(e) => setPassword(e.target.value)} required />
                    </label>
                    <label htmlFor='signup-confirm-password'>
                        Confirm Password:
                        <input type="password" id='signup-confirm-password' onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </label>
                    <button type='submit'>Sign Up</button><br />
                    <p>Already have an account? <Link to='/login'>Log In</Link></p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
