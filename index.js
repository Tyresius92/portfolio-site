// Require dependencies
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var expressSanitizer = require("express-sanitizer");
var expressSession = require("express-session");
var flash = require("connect-flash");
var nodemailer = require("nodemailer");
var methodOverride = require("method-override");
var middleware = require("./middleware");

// import user model for Passport setup
var User = require("./models/user");

// import routes
var indexRoutes = require("./routes/index");
var projectRoutes = require("./routes/projects");
var aboutRoutes = require("./routes/about");

// Set default environment
env = process.env.NODE_ENV || "development";

// Create default database URL
var dburl = process.env.DATABASEURL || "mongodb://localhost:27017/portfolio";

// Connect to the database
mongoose.connect(dburl, { useNewUrlParser: true }).catch(function(reason) {
    console.log("Unable to connect to the mongodb instance. Error: ", reason);
});

// Set up default app settings
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
app.set("view engine", "ejs");

// force https in production
// if (env === 'production') {
//     app.use(middleware.forceSsl);
// }

app.use(
    expressSession({
        secret: process.env.EXPRESS_SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up flash messages and current user
app.use(flash());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// Set up the route prefixes
app.use("/", indexRoutes);
app.use("/projects", projectRoutes);
app.use("/about", aboutRoutes);

// Set up the error 404 page
app.use(function(req, res, next) {
    res.status(404).render("not_found");
});

// Decide on a port, then listen for requests
var port = process.env.PORT || 3000;

app.listen(port, function() {
    console.log("The server has started!");
});
