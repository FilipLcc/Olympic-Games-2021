import mongoose from "mongoose";


let User = new mongoose.Schema({
    _id:{
        type:String
    },
    name:{
        type:String
    },
    surname:{
        type:String
    },
    username:{
        type:String
    },
    password:{
        type:String
    },
    nation:{
        type:String
    },
    email:{
        type:String
    },
    role:{
        type:String
    },
    delegated_competitions:{
        type:Array
    }
});

//Array(), Array<Object>()



export default mongoose.model("User", User, "User");