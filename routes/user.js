require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const middleware = require('../middleware');
//!login etc
//form
router.get('/register', (req, res) => {
	res.render('register');
});
//add user
router.post('/register', (req, res) => {
	const { username } = req.body;
	let newUser = new User({ username });
	User.register(
		newUser,
		req.body.password,
		(err, user) => {
			if (err) {
				return res.render('register');
			}
			passport.authenticate('local')(req, res, () => {
				req.flash(
					'success',
					'Succesfully, created your account'
				);
				res.redirect('/');
			});
		}
	);
});
//form
router.get('/login', (req, res) => {
	res.render('login');
});
//user login
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect : '/',
		failureRedirect : '/login'
	}),
	(req, res) => {}
);
//logout
router.get('/logout', middleware, (req, res) => {
	req.logout();
	req.flash('success', 'Succesfully, logged you out');
	res.redirect('/login');
});
module.exports = router;
