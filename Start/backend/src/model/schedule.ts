import mongoose from "mongoose";
import { ObjectID } from 'bson';


let Schedule = new mongoose.Schema({
    _id:{
        type:ObjectID
    },
    id_competition:{
        type:String
    },
    mySchedule:{
        type:Object
    }
});

//Array(), Array<Object>()



export default mongoose.model("Schedule", Schedule, "Schedule");