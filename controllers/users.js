const User = require('../models/user');

//signup form
module.exports.signupForm = (req, res) => {
    res.render('users/signup.ejs');
};
//signup logic
module.exports.signup =async (req, res) => {
    try {
        let { email, username, password } = req.body;
        let newuser = new User({ email, username });
        const registeredUser= await User.register(newuser,password)
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err){
                return next(err);
            };
            req.flash('success', 'Welcome to StayFinder!');
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};

//login form
module.exports.loginForm = (req, res) => {
    res.render('users/login.ejs');
};

//logout logic
module.exports.login = async (req, res) => {
        req.flash('success', 'Welcome back!');
        res.redirect(res.locals.redirectUrl || '/listings');
};

//logout logic

module.exports.logout = (req, res,next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', "Logged you out!");
        res.redirect('/listings');
    });
}