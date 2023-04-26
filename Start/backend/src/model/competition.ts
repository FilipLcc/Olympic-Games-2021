import mongoose from "mongoose";
import { ObjectID } from 'bson';

let Competition = new mongoose.Schema({
    _id:{
        type:ObjectID
    },
    competition_name:{
        type:String
    },
    start_date:{
        type:Date //Date behaves as string
    },
    end_date:{
        type:Date //Date behaves as string
    },
    sport:{
        type:String
    },
    discipline:{
        type:String
    },
    gender:{
        type:String
    },
    format:{
        type:String
    },
    venues:{
        type:Array
    },
    participants:{
        type:Array
    },
    delegate:{
        type:String
    },
    formed:{
        type:Boolean
    },
    over:{
        type:Boolean
    }
});

//Array(), Array<Object>()



export default mongoose.model("Competition", Competition, "Competition");