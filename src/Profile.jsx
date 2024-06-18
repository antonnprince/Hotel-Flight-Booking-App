import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom'
import axios from 'axios'


const Profile = () => {  
  const auth=useAuth()
  const user= auth.user
    
  if(!auth?.user)
    { 
      return <Navigate to="/login"/>
    } 


  const getDetails = async()=>
    { 
        try 
        {
          const response = await axios.get(`http://localhost:3001/details/${user.email}`)
          return response.data
        } 
        catch (error) 
        {
          console.log(error)
        }
  }

  const [currentUser,setCurrentUser]=useState()  
  const [todos,setTodos] = useState([])  
  const [title, setTitle] = useState("")
  const [description, setDescription]=useState("")
  const [dueDate, setDueDate]=useState(Date)
  const [status,setStatus]=useState(false)
  

  useEffect(()=>{

  const fetchData=async()=>{
    const data = await getDetails()
    if(data)
      { 
        console.log(data)
        setCurrentUser(data)
        setTodos(data.todos)
      } 
  }

  fetchData()
  },[])
 

  const handleTodos=async ()=>{
    if(title===""||description===""||dueDate==="")
       { 
        alert("All fields are required")
        return
       }

    const newTodo=
    {
        email:user.email,
        todo:{
            title: title,
            description:description,
            dueDate:dueDate,
            completed:false
        }
    }

    setTodos((prev)=>([...prev, {
        title: title,
        description:description,
        dueDate:dueDate,
        completed:status
    }]))     

    const res = await axios.post("http://localhost:3001/add_todo", newTodo)
    setTitle("")
    setDescription("")
    setDueDate(new Date())
  }
  
  const removeTodo=async(index)=>{
    const res = await axios.delete(`http://localhost:3001/remove_todo/${user.email}/${index}`)
    if(res.status===200)
        {
            alert("Successfully deleted")
            setTodos((prevTodos)=>prevTodos.filter((todo, i)=> i !== index));
            console.log(todos)
        }
    }

const handleStatus=async(index)=>{
    setStatus(!status)
    const res = await axios.put("http://localhost:3001/update_todo_status",{email:user.email,index:index,completed:status})
    if(res.status===200)
        {
            alert("Status updated successfully")
        }
    const newTodos=[...todos]
    newTodos[index].completed=status
    setTodos(newTodos)
}
    return (
      currentUser && (
        <div className='flex flex-col text-2xl items-center'>        
          <h1>Logged in as {currentUser.email}</h1>
          <h1 className='mb-12'>Welcome back {currentUser.username}</h1> 

            <div className='bg-[#9CA3AF] rounded-xl my-4 w-fit p-4 mx-auto space-y-2'>
                <div className='flex flex-row'>
                    <h2>Title </h2>
                    <input className='rounded-xl mx-2 p-1 ml-auto'
                    onChange={(e)=>setTitle(e.target.value)}
                    value={title}
                    /> 
                </div>
                
                <div className='flex flex-row my-2 space-x-2  '>
                    <h2>Description </h2>
                    <textarea className='ml-auto rounded-xl mx-2 p-1' 
                    type='text'
                    onChange={(e)=>setDescription(e.target.value)}
                    value={description}
                    /> 
                </div>
                
                <div className='flex flex-row'>
                    <h2>Date </h2>
                    <input className='mx-auto rounded-xl mx-2 p-1' 
                    type="date"
                    onChange={(e)=>setDueDate(e.target.value)}
                    value={dueDate}
                    /> 
                </div>
            </div>
         <button className='bg-[#16a34a] p-2 rounded-xl'
         onClick={handleTodos}
         >
            Save Changes
         </button>
          {
            todos.map((todo,index)=>(
                
              <div key={index} className='flex flex-col my-8 bg-[#7DD3FC] rounded-lg w-fit mx-auto p-4 text-3xl'>
                
                <div className='flex flex-row'>
                    <h2><span className="font-bold">Title: </span>{todo.title}</h2>
                    <span className='ml-auto w-auto text-[#991B1B] text-2xl font-extrabold' onClick={()=>removeTodo(index)}>X</span>
                </div>

                <h2><span className="font-bold">Description: </span>{todo.description}</h2>
                <h2><span className="font-bold">Due Date: </span>{todo.dueDate}</h2>
                
                <div className='flex flex-row'>
                   
                    <h2 className='font-bold'>Status: </h2>
                    <input type='checkbox'
                    onClick={()=>{handleStatus(index)}}
                    onChange={(e)=>setStatus(e.target.checked)}
                    checked={todo.completed}
                    className='mx-8 w-8 h-8 mx-2 p-4' 
                    />     
                </div>

              </div>
            ))
          }
        
          <button
            className='bottom-0 text-white font-bold bg-blue-700 w-1/4 p-2 rounded-lg mx-auto'
            onClick={() => auth.logout()}
          >
            Logout
          </button>
        </div>
      )
    );
  };
  
  export default Profile;