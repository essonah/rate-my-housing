
import React,{useState} from "react";

export const Signin=({onFormSwitch})=>{
    const[email,setEmail]=useState('');
    const[pass,setPass]=useState('');
    const[name,setName]=useState('');

    const handleSubmit =(e)=>{
        e.preventDefault();
        console.log(email);

    }
    

    

    return(
        <div className="auth-form-container">
            <h2>Signup</h2>
        <form className="signin-form"onSubmit={handleSubmit}>

            <label htmlFor="full_name">Full  Name</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder="full name" id="full_name" name="full_name"/>


            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="youremail@gmail.com" id="email" name="email"/>

            <label htmlFor="password">Password</label>
            <input value={pass} onChange={(e) =>setPass(e.target.value)} type="password" placeholder="*********" id="password" name="password"/>

            <button className="signin_btn" type='submit'>Signin</button>
        </form>
        <button className="link-btn" onClick={() =>{console.log("button clicked");onFormSwitch('login')}}> Already have an account? Login here</button>
        </div>
    );
}
