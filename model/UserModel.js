import mongoose from "mongoose";
const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        required: true
    }
}, 

    { _id: false }

);

const UserSchema = mongoose.Schema({
        email:{
            type: String,
            required: true,
            unique:true
        },

        username:{
            type:String,
            required:true,
        },

        password:{
            type:String,
            required:true,
        },

        todos:{
            type: [TodoSchema],
            required:true
        }
},
    {
        timeStamps:true
    }
)

export const User = mongoose.model('Hotel/Flight Users',UserSchema)