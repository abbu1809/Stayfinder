const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');  
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require("./utils/wrapasync");
const ExpressError = require('./utils/ExpressError');
const {listingSchema} = require('./schema.js');

const MONGO_URL= 'mongodb://127.0.0.1:27017/stayfinder'
main().then(() => {
  console.log('Connected to MongoDB');
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

app.get('/', (req, res) => {
  res.send('Hello World!');
  
});

const validateListing = (req, res, next) => {
  let{error} = listingSchema.validate(req.body);
   let errMsg =error.details.map((el)=>el.message).join(',');
   if(error){
    throw new ExpressError(400, error);
   }else{
    next();
   }
}
//index route
app.get('/listings',wrapAsync( async (req, res) => {
  const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
  })
);
  //lsings new route
app.get('/listings/new', (req, res) => {
  res.render('listings/new.ejs');
});
//show route
app.get('/listings/:id',wrapAsync(async (req, res,) => {
  const{id} = req.params;
  const listing= await Listing.findById(id); 
  res.render("listings/show.ejs", {listing});
}));
//create route
app.post('/listings', validateListing,
   wrapAsync(async (req, res, next) => {
  
  const newListing = new Listing(req.body);
  await newListing.save();
  res.redirect('/listings');
})
);
//edit route
app.get('/listings/:id/edit',wrapAsync(async (req, res) => {
  const{id} = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', {listing});
}));
//update route
app.put('/listings/:id' , validateListing, wrapAsync(async (req, res) => {
  const{id}=req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body});
  res.redirect(`/listings/${updatedListing._id}`); // Redirect to the updated listing's show page
}));
//delete route
app.delete('/listings/:id',wrapAsync(async(req,res)=>{
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
}));

// Catch-all 404 (works in Express 5)
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});