const Review = require('../models/review');
const Listing = require('../models/listing');

module.exports.newReview=async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  listing.reviews.push(review);

  await review.save();
  await listing.save();
  req.flash('success', 'Successfully New created!');

  res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview=async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'deleted review!');
  res.redirect(`/listings/${id}`);
}