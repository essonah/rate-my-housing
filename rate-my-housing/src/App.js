import React, {useState} from "react"
// import logo from './logo.svg';
import './App.css';
import { Login } from './components/Login';
import { Signin } from './components/Signin';

function App() {
  const [currentForm,setCurrentForm]=useState('signin');
  const toggleForm =(formName) =>{
    setCurrentForm(formName);
  }
  return (
    <div className="App">
      {
        currentForm==="signin"?<Signin onFormSwitch={toggleForm}/>:<Login onFormSwitch={toggleForm} />
      }
      
    </div>
  );
}

export default App;
