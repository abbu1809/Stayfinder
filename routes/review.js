const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const wrapAsync = require("../utils/wrapasync");
const ExpressError = require('../utils/ExpressError');
const {reviewSchema} = require('../schema.js');
const Listing = require('../models/listing');


//for review validation
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  let errMsg = error && error.details ? error.details.map((el) => el.message).join(",") : "";
  if (error) {
    // If error is about extra fields, show a user-friendly message
    throw new ExpressError(errMsg || 'Invalid review data', 400);
  } else {
    next();
  }
};

//reviews routes
router.post('/',validateReview, wrapAsync(async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  const review = new Review(req.body.review);
  listing.reviews.push(review);

  await review.save();
  await listing.save();
  req.flash('success', 'Successfully New created!');

  res.redirect(`/listings/${listing._id}`);
}));
//delete review route
router.delete('/:reviewId', wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'deleted review!');
  res.redirect(`/listings/${id}`);
}));


module.exports = router;