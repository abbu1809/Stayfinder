const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const wrapAsync = require("../utils/wrapasync");
const Listing = require('../models/listing');
const { validateReview, isloggedin, isReviewauthor } = require('../middleware');
const reviewController = require('../controllers/review');

//for review validation


//reviews routes
router.route('/').post(isloggedin,validateReview,wrapAsync(reviewController.newReview));
//delete review route
router.route('/:reviewId').delete(isloggedin,isReviewauthor,wrapAsync(reviewController.deleteReview));


module.exports = router;