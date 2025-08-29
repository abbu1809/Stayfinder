const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash'); 
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter= require('./routes/user.js');
const e = require('connect-flash');

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


const sessionOptions = {
  secret:"thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expire: Date.now() + 1000*60*60*24*7,
    maxAge: 1000*60*60*24*7,
    httpOnly: true,

  }
}

app.get('/', (req, res) => {
  res.redirect('/listings'); 
});


app.use(session(sessionOptions));
app.use(flash()); 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// app.get('/demouser', async (req, res) => {
//   let fakeUser = new User({
//     email:'student@gmail.com',
//     username:'student-abhi'
//   });
//  let registerUser= await  User.register(fakeUser, 'hello123');
// res.send(registerUser);
// });
app.use('/listings', listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use('/', userRouter);

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