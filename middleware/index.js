
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash("error", "I'm sorry, Dave. I'm afraid you can't do that");
    res.redirect("/");
}

module.exports = middlewareObj;