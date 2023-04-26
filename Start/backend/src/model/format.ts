import mongoose from "mongoose";


let Format = new mongoose.Schema({
    _id:{
        type:String
    },
    format_name:{
        type:String
    },
    fixture:{
        type:String
    },
    num_of_players:{
        type:Number
    },
    result_format:{
        type:String
    },
    num_of_reps:{
        type:Number
    }
});

//Array(), Array<Object>()



export default mongoose.model("Format", Format, "Format");