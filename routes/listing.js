const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync");
const ExpressError = require('../utils/ExpressError');
const {listingSchema} = require('../schema.js');
const Listing = require('../models/listing');

const validateListing = (req, res, next) => {
  // Only validate for POST, PUT, PATCH
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const { error } = listingSchema.validate(req.body);
    if (error) {
      const errMsg = error.details.map((el) => el.message).join(', ');
      return next(new ExpressError(errMsg, 400));
    }
  }
  next();
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
router.get('/:id', wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate('reviews');
  if (!listing) {
    req.flash('error', 'Listing not found!');
    return res.redirect('/listings'); // <-- Add return here
  }
  res.render("listings/show.ejs", { listing });
}));
//create route
router.post('/', validateListing,
   wrapAsync(async (req, res, next) => {
  
  const newListing = new Listing(req.body);
  await newListing.save();
 
  req.flash('success', 'Successfully made a new listing!');
   
  res.redirect('/listings');
})
);
//edit route
router.get('/:id/edit', wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
   if (!listing) {
    req.flash('error', 'Listing not found!');
    return res.redirect('/listings'); // <-- Add return here
  }
  res.render('listings/edit.ejs', { listing });
}));
//update route
router.put('/:id' , validateListing, wrapAsync(async (req, res) => {
  const{id}=req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body});
  req.flash('success', 'Successfully updated listing!');
  res.redirect(`/listings/${updatedListing._id}`); // Redirect to the updated listing's show page
}));
//delete route
router.delete('/:id', wrapAsync(async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    req.flash('error', 'Listing not found or already deleted!');
    return res.redirect('/listings');
  }
  req.flash('success', 'Listing deleted successfully!');
  res.redirect('/listings');
}));

module.exports = router;