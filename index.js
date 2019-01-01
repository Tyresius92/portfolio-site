var express = require("express"); 
var app = express(); 
var bodyParser = require("body-parser"); 
var expressSession = require("express-session");
var flash = require("connect-flash"); 
var nodemailer = require("nodemailer"); 

var port = process.env.PORT || 3000; 

app.use(express.static(__dirname + "/public")); 
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(expressSession({
    secret: "Is it really a secret if it's in this file?", 
    resave: false, 
    saveUninitialized: false
}))

app.use(flash()); 
app.use(function(req, res, next) {
    res.locals.error = req.flash("error"); 
    res.locals.success = req.flash("success"); 
    next(); 
});

app.get("/", function(req, res) {
    res.render("index"); 
});

app.get("/contact", function(req, res) {
    res.render("contact"); 
})

app.post("/contact", function(req, res) {
    var smtpTransport = nodemailer.createTransport({
        service: "Gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAILPW
        }
    });
    var mailOptions = {
        from: 'Tyrel Clayton <' + process.env.GMAIL + '>',
        to: process.env.EMAIL,
        replyTo: req.body.email,
        subject: req.body.subject, 
        text: "Someone reached out to you at tyrelclayton.com! \n\nName: " + req.body.name + "\n\nEmail: " + req.body.email + "\n\nMessage:\n\n" + req.body.message,
        html: "<h3>Someone reached out to you at tyrelclayton.com!</h3><ul><li><strong>Name:</strong> " + req.body.name + "</li><li><strong>Email:</strong> " + req.body.email + "</li></ul><p>Message:<br/><br/>" + req.body.message + "</p>"
    };

    smtpTransport.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err); 
            req.flash("error", "Something went wrong. Please try again or reach out to tyrel@tyrelclayton.com"); 
            res.redirect("/contact");
        }
        req.flash("success", "Your message was sent! Tyrel should be in touch soon!");
        res.render("index"); 
    });
});

app.use(function(req, res, next) {
    res.status(404).render("not_found"); 
});

app.listen(port, function() {
    console.log("The server has started!"); 
});