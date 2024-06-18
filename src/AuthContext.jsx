import { useState } from "react";
import { useContext,createContext } from "react";
import {useNavigate} from "react-router-dom"
import axios from "axios";

const AuthContext = createContext()

export const AuthProvider=({children})=>{

    const [user,setUser]=useState()
    const navigate=useNavigate()

    const login=async(data)=>{
        try 
        {
            
            const res = await axios.post("http://localhost:3001/login",
                {email:data.email, password: data.password})    
            if(res.status===200)
                {
                    setUser(data)
                    navigate('/profile')
                    return res
                }
               else
               {
                alert(res)
               }
            return res
        } 
        catch (error) 
        {
            console.log(error)
            return error
        }
    }
    
    const logout=()=>{
        setUser(null)
        navigate('/login')
    }

    return(
        <AuthContext.Provider value={{login,logout,user}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth=()=>{
    return(
        useContext(AuthContext)
    )
}