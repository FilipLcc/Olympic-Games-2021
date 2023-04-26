import mongoose from "mongoose";


let Venue = new mongoose.Schema({
    _id:{
        type:String
    },
    name:{
        type:String
    },
    sports:{
        type:Array
    },
    busy_dates:{
        type:Array
    },
    image:{
        type:String
    }
});

//Array(), Array<Object>()



export default mongoose.model("Venue", Venue, "Venue");