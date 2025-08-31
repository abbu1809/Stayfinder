const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const wrapasync = require('../utils/wrapasync');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware');
const userController = require('../controllers/users');

//signup route
router.route('/signup').get(userController.signupForm )
.post(wrapasync( userController.signup));
//login route
router.route('/login').get( userController.loginForm)
.post(saveRedirectUrl, passport.authenticate('local',{failureRedirect:'/login',failureFlash:true,}), userController.login);
//logout route
router.route('/logout').get(userController.logout);

module.exports = router;