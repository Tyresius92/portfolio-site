// Require dependencies
var express = require("express"); 
var app = express(); 
var bodyParser = require("body-parser"); 
var expressSession = require("express-session");
var flash = require("connect-flash"); 
var nodemailer = require("nodemailer"); 

// import routes
var indexRoutes = require("./routes/index"); 

// Set up default app settings
app.use(express.static(__dirname + "/public")); 
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(expressSession({
    secret: process.env.EXPRESS_SECRET, 
    resave: false, 
    saveUninitialized: false
}));

// Set up flash message framework
app.use(flash()); 
app.use(function(req, res, next) {
    res.locals.error = req.flash("error"); 
    res.locals.success = req.flash("success"); 
    next(); 
});

// Set up the route prefixes
app.use("/", indexRoutes); 

// Set up the error 404 page
app.use(function(req, res, next) {
    res.status(404).render("not_found"); 
});

// Decide on a port, then listen for requests
var port = process.env.PORT || 3000; 

app.listen(port, function() {
    console.log("The server has started!"); 
});