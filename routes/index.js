var express = require("express"); 
var router = express.Router(); 
var nodemailer = require("nodemailer"); 
var passport = require("passport"); 
var User = require("../models/user"); 


router.get("/", function(req, res) {
    res.render("index"); 
});

router.get("/contact", function(req, res) {
    res.render("contact"); 
})

router.post("/contact", function(req, res) {
    var smtpTransport = nodemailer.createTransport({
        service: "Yahoo",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAILPW
        }
    });

    var mailOptions = {
        from: process.env.EMAIL,
        to: process.env.ALIAS, 
        replyTo: req.body.email,
        subject: req.body.subject, 
        text: req.body.name + " reached out to you at tyrelclayton.com! \n\nName: " + req.body.name + "\n\nEmail: " + req.body.email + "\n\nMessage:\n\n" + req.sanitize(req.body.message),
        html: "<h3>" + req.body.name + " reached out to you at tyrelclayton.com!</h3><ul><li><strong>Name:</strong> " + req.body.name + "</li><li><strong>Email:</strong> " + req.body.email + "</li></ul><p>Message:<br/><br/>" + req.sanitize(req.body.message) + "</p>"
    };

    smtpTransport.sendMail(mailOptions, function(err, info) {
        if (err) {
            console.log(err); 
            req.flash("error", "Something went wrong. Please try again or reach out to " + process.env.ALIAS); 
            res.redirect("/contact");
        }
        req.flash("success", "Your message was sent! Tyrel should be in touch soon!");
        res.redirect("/"); 
    });
});

router.get("/about", function(req, res) {
    res.render("about"); 
});

router.get("/register", function(req, res) {
    res.render("register"); 
});

router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username}); 

    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err); 
            req.flash("error", err.message); 
            return res.redirect("register"); 
        }
        passport.authenticate("local")(req, res, function() {
            req.flash("success", "Account created! Now go delete these routes"); 
            res.redirect("/"); 
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login"); 
});

router.post("/login", 
    passport.authenticate("local", 
        {
            failureRedirect: "/", 
            successFlash: "Welcome back you sexy bitch!!", 
            failureFlash: true
        }), 
    function(req, res) {
        res.redirect("/"); 
    }
);

router.get("/logout", function(req, res) {
    req.logout(); 
    res.redirect("/"); 
});

module.exports = router;