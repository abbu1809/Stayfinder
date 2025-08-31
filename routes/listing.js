const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapasync");
const Listing = require('../models/listing');
const { isloggedin ,isOwner,validateListing } = require('../middleware');
const listingController = require('../controllers/listings'); 
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage });


//index route
router.route('/').get(wrapAsync(listingController.index))
//create route
.post(isloggedin, upload.single('image'),validateListing,
    wrapAsync(listingController.create));
//listings new route
router.route('/new').get(isloggedin, listingController.new);
//show route
router.route('/:id').get(wrapAsync(listingController.show))
//update route
.put( isloggedin,isOwner,validateListing, wrapAsync(listingController.update))
//delete route
.delete(isloggedin, isOwner,wrapAsync(listingController.delete));
//edit route
router.route('/:id/edit').get(isloggedin,isOwner, wrapAsync(listingController.edit));

module.exports = router;