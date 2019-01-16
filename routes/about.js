var express = require("express"); 
var router = express.Router({mergeParams: true});

router.get("/", function(req, res) {
    res.render("about/about"); 
});

router.get("/impossible-list", function(req, res) {
    res.render("about/impossible"); 
});

module.exports = router;