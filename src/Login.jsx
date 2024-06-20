import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'



const Login = () => {
  
  const auth=useAuth()
  const [input, setInput] = useState({
    username: "",
    password: "",
  }); 

  const handleSubmitEvent = (e) => {  
  e.preventDefault();
    if (input.username !== "" || input.password !== "")
    {   
        auth.login(input) 
        return
    }
    else
    toast.error("Enter all details",{
      position: "top-center", 
      autoClose: 2000, 
      pauseOnHover:false,
      theme:"dark"
    })
  };

 

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmitEvent} className="text-xl flex flex-col space-y-4 space-x-4">
      
      <div >
        Email:
        <input
          type="email"
          id="user-email"
          name="email"
          placeholder="example@yahoo.com"
          aria-describedby="user-email"
          aria-invalid="false"
          onChange={handleInput}
        />
      </div>

      <div className="form_control">
        Password:
        <input
          type="password"
          id="password"
          name="password"
          aria-describedby="user-password"
          aria-invalid="false"
          onChange={handleInput}
        />
      </div>


    <div className="">
      <button 
      className="p-2 m-4 bg-[#60A5FA] rounded-xl">
        Submit
      </button>
      
      <button className="p-2 bg-[#60A5FA] rounded-xl">
        <Link to="/register">
        Register Here
        </Link>
        </button>
    </div>
    </form>
  );
};

export default Login;
