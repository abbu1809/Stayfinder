const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const wrapasync = require('../utils/wrapasync');
const passport = require('passport');


router.get('/signup', (req, res) => {
    res.render('users/signup.ejs');
}
);

router.post('/signup',wrapasync( async (req, res) => {
    try {
         let { email, username, password } = req.body;
    let newuser = new User({ email, username });
    const registeredUser= await User.register(newuser,password)
    console.log(registeredUser);
    req.flash('success', 'Welcome to StayFinder!');
    res.redirect('/listings');
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
}));


router.get('/login', (req, res) => {
    res.render('users/login.ejs');
});

router.post('/login', passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}), async (req, res) => {
req.flash('success', 'Welcome back!');
res.redirect('/listings');

});

module.exports = router;