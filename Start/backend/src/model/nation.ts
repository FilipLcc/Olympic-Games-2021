import mongoose from "mongoose";


let Nation = new mongoose.Schema({
    _id:{
        type:String
    },
    name:{
        type:String
    },
    short_name:{
        type:String
    },
    flag:{
        type:String
    },
    gold_cnt:{
        type:Number
    },
    silver_cnt:{
        type:Number
    },
    bronze_cnt:{
        type:Number
    },
    overall:{
        type:Number
    },
    athlete_cnt:{
        type:Number
    },
    teams_cnt:{
        type:Number
    },
    rank:{
        type:Number
    }
});

//Array(), Array<Object>()



export default mongoose.model("Nation", Nation, "Nation");