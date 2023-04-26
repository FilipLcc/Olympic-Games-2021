import mongoose from "mongoose";
import { ObjectID } from 'bson';


let Athlete = new mongoose.Schema({
    _id:{
        type:ObjectID //was String
    },
    name:{
        type:String
    },
    surname:{
        type:String
    },
    nation:{
        type:String
    },
    gender:{
        type:String
    },
    sport:{
        type:String
    },
    disciplines:{
        type:Array
    },
    medals:{
        type:Boolean
    },
    carrier:{
        type:Number
    }
});

//Array(), Array<Object>()



export default mongoose.model("Athlete", Athlete, "Athlete");