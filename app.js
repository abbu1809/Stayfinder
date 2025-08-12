const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');  
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');


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
//index route
app.get('/listings', async (req, res) => {
  const allListings= await Listing.find({});
    res.render("listings/index.ejs", {allListings});
  });
  //lsings new route
app.get('/listings/new', (req, res) => {
  res.render('listings/new.ejs');
});
//show route
app.get('/listings/:id',async (req, res) => {
  const{id} = req.params;
  const listing= await Listing.findById(id); 
  res.render("listings/show.ejs", {listing});
});
//create route
app.post('/listings', async (req, res) => {
  const newListing = new Listing(req.body);
  await newListing.save();
  res.redirect('/listings');
});
//edit route
app.get('/listings/:id/edit',async (req, res) => {
  const{id} = req.params;
  const listing = await Listing.findById(id);
  res.render('listings/edit.ejs', {listing});
});
//update route
app.put('/listings/:id',async (req, res) => {
  const{id}=req.params;
  const updatedListing = await Listing.findByIdAndUpdate(id, {...req.body});
  res.redirect(`/listings/${updatedListing._id}`); // Redirect to the updated listing's show page
});
//delete route
app.delete('/listings/:id',async(req,res)=>{
  const {id} = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect('/listings');
})
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});