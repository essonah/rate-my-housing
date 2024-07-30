import React,{useState} from "react";

export const Login=({onFormSwitch})=>{
    const[email,setEmail]=useState('');
    const[pass,setPass]=useState('');
    
    const handleSubmit =(e)=>{
        e.preventDefault();
        console.log(email);

    }

    return(
        <div className="auth-form-container">
            <h2>Login</h2>
        <form  className="login-form" onSubmit={handleSubmit}>
           

            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)}type="email" placeholder="youremail@gmail.com" id="email" name="email"/>


            <label htmlFor="password">Password</label>
            <input value={pass} onChange={(e) =>setPass(e.target.value)}type="password" placeholder="*********" id="password" name="password"/>

            <button className="login_btn" type='submit'>Login</button>
        </form>
        <button  className="link-btn" onClick={() =>onFormSwitch('signin')}>Don't have an account.Signup here</button>
        </div>
    );


}

// function Login(){
//     return(
//       <div> </div>
//     )
// }
// export default Login;