const mongoose = require('mongoose');
const review = require('./review.js');
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
listingSchema.post("findOneAndDelete",async(Listing)=>{
    if(listing){
       await Review.deleteMany({_id:{$in: listin.reviews}})
    }
})
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;