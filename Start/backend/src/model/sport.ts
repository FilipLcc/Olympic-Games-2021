import mongoose from "mongoose";


let Sport = new mongoose.Schema({
    _id:{
        type:String
    },
    name:{
        type:String
    }
});

//Array(), Array<Object>()



export default mongoose.model("Sport", Sport, "Sport");