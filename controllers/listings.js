const Listing = require('../models/listing');
const ExpressError = require('../utils/ExpressError');
const review = require('../models/review');
const {listingSchema} = require('../schema.js');
//inex route
module.exports.index= async (req, res) => {
  const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

//listings new route
module.exports.new =(req, res) => {
  res.render('listings/new.ejs');
}

//show route
module.exports.show =async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id).populate({path:'reviews',
  populate:{path:'author'}
  }).populate('owner');
  if (!listing) {
    req.flash('error', 'Listing not found!');
    return res.redirect('/listings'); // <-- Add return here
  }
  res.render("listings/show.ejs", { listing });
};

//create route
module.exports.create=async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
 
  const newListing = new Listing(req.body);
  newListing.owner=req.user._id;
  newListing.image = {url, filename};
  await newListing.save();
  req.flash('success', 'Successfully made a new listing!');
  res.redirect('/listings');
};

//edit route

module.exports.edit =async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
   if (!listing) {
    req.flash('error', 'Listing not found!');
    return res.redirect('/listings'); // <-- Add return here
  }
  res.render('listings/edit.ejs', { listing });
};

//update route
module.exports.update= async (req, res) => {
  const{id}=req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body});
  req.flash('success', 'Successfully updated listing!');
  res.redirect(`/listings/${updatedListing._id}`); // Redirect to the updated listing's show page
};

//delete route
module.exports.delete=async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    req.flash('error', 'Listing not found or already deleted!');
    return res.redirect('/listings');
  }else{
  req.flash('success', 'Listing deleted successfully!');
  res.redirect('/listings'||'/');
  }
}