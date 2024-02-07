const mongoose = require('mongoose')

const jobSchema = mongoose.Schema({
    companyName:{
        type:String,
        required:true,
    },
    position:{
        type:String,
        required:true,
    },
    jobDescription:{
        type:String,
        required:true,
    },
    logo:{
        type:String,
        required:true,
    },
    salary:{
        type:Number,
        required:true,
    },
    type:{
        type:String,
        required:true,
    },
    remoteOrOffice:{
        type:String,
        required:true,
    },
    jobLocation:{
        type:String,
        required:true,
    },
    about:{
        type:String,
        required:true,
    },
    skills:{
        type:[String],
        required:true,
    },
    info:{
        type:String,
        required:true,
    },
    time:{
        type:Date,
        default:Date.now()
    }

    // refUserId:{
    //     type:mongoose.Types.ObjectId,
    //     required:true,
    // }
})

module.exports = mongoose.model("Job",jobSchema)