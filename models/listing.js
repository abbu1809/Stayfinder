const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title:{
        type:String,
        required: true,
    },
    description: String,
    image: {
        filename: String,
        url: String,
    },
    price: Number,
    location: String,
    country: String,

    //one to many relationship
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: 'Review',
    }],
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;