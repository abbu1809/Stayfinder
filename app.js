const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');


const listings = require('./routes/listing.js');
const reviews = require('./routes/review.js');

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
  res.redirect('/listings'); 
});

app.use('/listings', listings);
app.use("/listings/:id/reviews", reviews);


// Catch-all 404 (works in Express 5)
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
  const statusCode = typeof err.statusCode === "number" ? err.statusCode : 500;
  let message = err.message || "Something went wrong";
  // If Joi error, extract message safely
  if (err && err.details && Array.isArray(err.details)) {
    message = err.details.map(el => el.message).join(", ");
  }
  res.status(statusCode).render("error.ejs", { message });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});