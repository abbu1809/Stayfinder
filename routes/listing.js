const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync");
const ExpressError = require('../utils/ExpressError');
const {listingSchema} = require('../schema.js');
const Listing = require('../models/listing');

const validateListing = (req, res, next) => {
  let{error} = listingSchema.validate(req.body);
   let errMsg =error.details.map((el)=>el.message).join(',');
   if(error){
    throw new ExpressError(400, error);
   }else{
    next();
   }
};
//index route
router.get('/',wrapAsync( async (req, res) => {
  const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
  })
);
  //lsings new route
router.get('/new', (req, res) => {
  res.render('listings/new.ejs');
});
//show route
router.get('/:id',wrapAsync(async (req, res,) => {
  const{id} = req.params;
  const listing= await Listing.findById(id).populate('reviews');
  res.render("listings/show.ejs", {listing});
}));
//create route
router.post('/', validateListing,
   wrapAsync(async (req, res, next) => {
  
  const newListing = new Listing(req.body);
  await newListing.save();
  res.redirect('/listings');
})
);
//edit route
router.get('/:id/edit',wrapAsync(async (req, res) => {
  const{id} = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', {listing});
}));
//update route
router.put('/:id' , validateListing, wrapAsync(async (req, res) => {
  const{id}=req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body});
  res.redirect(`/listings/${updatedListing._id}`); // Redirect to the updated listing's show page
}));
//delete route
router.delete('/:id',wrapAsync(async(req,res)=>{
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
}));

module.exports = router;