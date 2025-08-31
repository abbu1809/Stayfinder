const Listing = require('./models/listing');
const Review = require('./models/review.js');
const { listingSchema,reviewSchema } = require('./schema.js');
const ExpressError = require('./utils/ExpressError');

module.exports.validateListing = (req, res, next) => {
  // Only validate for POST, PUT, PATCH
let {error}= listingSchema.validate(req.body);
if(error){
  let ermsg= error.details.map((el)=>el.message).join(',');
  throw new ExpressError(ermsg,400);
}else{
  next();
}
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  let errMsg = error && error.details ? error.details.map((el) => el.message).join(",") : "";
  if (error) {
    // If error is about extra fields, show a user-friendly message
    throw new ExpressError(errMsg || 'Invalid review data', 400);
  } else {
    next();
  }
};


module.exports.isloggedin = (req, res, next) => {

  if (!req.isAuthenticated()) {
    //redirect url
    req.session.redirectUrl = req.originalUrl;
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
}


module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/listings/${id}`);
  }
  next();
};


module.exports.isReviewauthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currentUser ._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/listings/${id}`);
  }
  next();
};