import mongoose from "mongoose";


let Discipline = new mongoose.Schema({
    _id:{
        type:String
    },
    name:{
        type:String
    },
    sport:{
        type:String
    },
    ind_or_group:{
        type:String
    }//,
    // format:{
    //     type:String
    // }
});

//Array(), Array<Object>()



export default mongoose.model("Discipline", Discipline, "Discipline");