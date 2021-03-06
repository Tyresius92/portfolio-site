
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash("error", "I'm sorry, Dave. I'm afraid you can't do that");
    res.redirect("/");
}

middlewareObj.forceSsl = function(req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(['https://', req.get('Host'), req.url].join(''));
    }
    return next();
}

module.exports = middlewareObj;