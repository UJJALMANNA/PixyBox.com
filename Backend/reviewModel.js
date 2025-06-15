const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user_details',
        required: true
    },
    rating:{
        type: Number,
        required: true
    },
    comment:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    country:{
        type: String,
        required: true
    }
},{timestamps: true})

const reviewModel = mongoose.model("review_details", reviewSchema);

module.exports = reviewModel;