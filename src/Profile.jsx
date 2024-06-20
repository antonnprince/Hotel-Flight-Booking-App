import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

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


  const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  useEffect(() => {

    const fetchData = async () => {
      const data = await getDetails()
      if (data) {  
        console.log(data)
        setCurrentUser(data)
        setTodos(data.todos)

        data.todos.forEach((todo) => {
          const todoDate = new Date(todo.dueDate)
          if (isToday(todoDate) && !todo.completed) {
            toast.info(`${todo.title} is due today!`, {
              position: "top-center", 
              autoClose: 2000, 
              pauseOnHover:false,
            });
            console.log("s: ", todoDate, "t: ", new Date())
          }
        })
      } 
    }
    fetchData()
  }, [])
   
  
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
            completed:status
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
    const newTodos=[...todos]
    newTodos[index].completed=!newTodos[index].completed
    setTodos(newTodos)
    const res = await axios.put("http://localhost:3001/update_todo_status",{email:user.email,index:index,completed:newTodos[index].completed})
    if(res.status===200)
        {
            alert("Status updated successfully")
        }
  
}

    return (
 
      currentUser && (
        <div className='bg-indigo-500 h-full w-full p-2 xs:w-2/3 sm:w-1/2 md:w-2/5 lg:w-1/4 xl:w-1/5 '>        

          <div className='bg-white rounded-xl m-2 flex flex-col items-center '>
            
            <h1 className='text-4xl sm:text-2xl md:text-3xl  lg:text-5xl p-4 font-light text-neutral-500 mr-auto'>Welcome back</h1> 
            <span className='text-7xl sm:text-3xl md:text-5xl  lg:text-7xl p-4 text-neutral-800 font-bold  mr-auto'>{currentUser.username}</span>
              
            
              <div className='rounded-xl my-8 w-auto lg:w-3/4 p-6 mx-auto space-y-2 shadow-xl shadow-stone-500/50'>
                   <div className="flex-col space-y-4 items-center justify-center ">
                    <div className="relative">
                        <h2 className='text-sm text-indigo-500'>
                        Title
                        </h2>

                       <input
                        type="text"
                        className="border-b border-gray-300 py-1 text-xl w-full  focus:border-b-2 focus:border-indigo-500 transition-colors focus:outline-none peer bg-inherit"
                        onChange={(e)=>setTitle(e.target.value)}
                        value={title}
                        />
                    </div>

                    <div className="relative">
                        <h2 className='text-sm text-indigo-500'>
                        Description
                        </h2>

                        <textarea
                          type="text"
                          className="border-b border-gray-300 py-1 text-xl w-full focus:border-b-2 focus:border-indigo-500 transition-colors focus:outline-none peer bg-inherit"
                          onChange={(e)=>setDescription(e.target.value)}
                          value={description}
                        />
                    </div>

                    <input className='ml-auto rounded-xl  focus:outline-none 
                    text-indigo-500
                    mx-auto p-1 text-lg' 
                      type="date"
                      onChange={(e)=>setDueDate(e.target.value)}
                      value={dueDate}
                      /> 

                  </div>    
              </div>
              
                <button 
                className='transition ease-in-out delay-100 hover:scale-110  text-xl duration-300
                bg-neutral-900 text-white px-8 py-2 rounded-xl font-semibold mx-auto'
                onClick={handleTodos}
                >
                   Add new Todo
                </button>
              
            
                {
                  todos.map((todo, index) => {
                    const localDate = new Date(todo.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
                    return (
                      <div key={index} className='flex flex-col my-8
                      w-4/5 border-2 rounded-2xl mx-2 border-zinc rounded-lg p-2'>
                        
                        <div className='flex flex-row'>  
                          <h2 className="text-sm">{localDate}</h2>
                          <span className='ml-auto text-red-600 
                          text-2xl font-extrabold hover:cursor-pointer' onClick={()=>removeTodo(index)}>X</span>
                        </div>
                        <h2 className="font-bold text-3xl">{todo.title}</h2>
                        <p className='mt-2 text-xl font-light'>{todo.description}</p>
                          <input 
                            type='checkbox'
                            onChange={()=>handleStatus(index)}
                            checked={todo.completed}
                            className='w-4 h-4 my-2 rounded-xl' 
                          />
                         
                      </div>
                    );
                  })
                }

          </div>
          <ToastContainer/>
        </div>
      )

    );
  };
  
  export default Profile;
