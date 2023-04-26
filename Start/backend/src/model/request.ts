import mongoose from "mongoose";


let Request = new mongoose.Schema({
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
    accepted:{
        type:String
    }
});

//Array(), Array<Object>()



export default mongoose.model("Request", Request, "Request");