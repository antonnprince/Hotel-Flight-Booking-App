import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from './model/UserModel.js'
import cors from 'cors'

dotenv.config()
const MONGO_URL=process.env.MONGO_URL

const app=express()
app.use(express.json())
app.use(cors())

mongoose.connect(MONGO_URL).then(()=>{
    console.log("Database connected")
    app.listen(3001, ()=>{
        console.log("Listening at 3001")
    })
}).catch((error)=>{
    console.log(error)
})

app.get('/', (req,res)=>{
    res.status(200).json("Welcome")
})

app.post('/register', async (req,res)=>{
    try 
    {
        const {email, username, password } = req.body
        const user = {email:email, username:username, password: password}
        await User.create(user)
        return res.status(200).json({message:"Successfully Registered"})
    } 
    catch (error) {
        return res.status(400).json({message:error})
    }
})

app.post('/login', async(req,res)=>{
    try 
    {
        const {email,password} = req.body
        const result = await User.find({email:email})
        // the result will be an empty array if no email found, or will be an array with one object if correct email is found
        // so we have to check if result array is empty or not, by using length property
        if(result.length!=0)
         {
            if(result[0].password===password)
                return res.status(200).json({message:"Successfully Logged In"})
            else
                return res.status(201).json({message:"Incorrect password"})
         }   
        else
            {
                return res.status(203).json({message:"Register first before logging in"})    
            }
    } 
    catch (error) 
    {
        return res.status(400).json({message:error})
    }
})

app.get('/details/:email', async(req,res)=>{
    const {email}=req.params
    const user = await User.findOne({email:email})
    if(user)
        return res.status(200).json(user)
    else
        return res.status(201).json({message:"User not found"})
})

app.post('/add_todo', async (req, res) => {
    try {
        const { email, todo } = req.body;
        if (!email || !todo)
        {
            return res.status(400).json({ message: 'Email and todo are required.' });
        }

        const todoItem = {
            title: todo.title,
            description: todo.description,
            dueDate: todo.dueDate,
            completed: todo.completed
        };

        const user = await User.findOneAndUpdate(
            { email: email },
            { $push: { todos: todoItem } },
            { new: true, useFindAndModify: false } // Return the updated document
        );

        if (!user)
        {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Respond with the updated user
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
});

app.put('/update_todo_status', async (req, res) => {
    const { email, index, completed } = req.body;

    try {
     
        if (email===undefined || index === undefined || completed === undefined) {
            return res.status(400).json({ message: "All values required" });
        }

     
        if (isNaN(index) || index < 0) {
            return res.status(400).json({ message: "Invalid index" });
        }

        
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (index >= user.todos.length) {
            return res.status(400).json({ message: "Index out of bounds" });
        }
        user.todos[index].completed = completed;
        await user.save();

        // Respond with the updated user
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Unexpected error" });
    }
});

app.delete('/remove_todo/:email/:index', async (req, res) => {
    const { email, index } = req.params;
  
    if (!email || !index) {
      return res.status(400).json({ message: "No valid fields present" });
    }
  
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      user.todos.splice(index, 1);
      await user.save();
      return res.status(200).json({ message: "Successfully deleted" });
    } catch (error) {
      if (error.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid data format for email or index' });
      } else if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Todo not found' });
      } else {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }
  });
  
