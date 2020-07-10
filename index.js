//?require
require('dotenv').config();
const express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	Todo = require('./models/todo'),
	seedDB = require('./seed'),
	methodOverride = require('method-override'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	User = require('./models/user'),
	passportLocalMongoose = require('passport-local-mongoose'),
	flash = require('connect-flash'),
	port = process.env.PORT || 3000;
//?routes
const todoRoutes = require('./routes/todo'),
	userRoutes = require('./routes/user');
//?mongoose config
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(
	process.env.DATABASEURL ||
		'mongodb://localhost:27017/todo_app'
);

//?app config
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride('_method'));
app.use(flash());
app.locals.moment = require('moment');

//?seedDb
// seedDB();
//?passport config
app.use(
	require('express-session')({
		secret            :
			process.env.DOG || 'I want a dog',
		resave            : false,
		saveUninitialized : false
	})
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});
//?routes
app.use('/', todoRoutes);
app.use('/', userRoutes);

//?listen
app.listen(port, () => {
	console.log(`started at ${port}`);
});
