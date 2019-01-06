var express = require("express"); 
var router = express.Router({mergeParams: true}); 
var Project = require("../models/project"); 

router.get("/", function(req, res) {
    Project.find({}, function(err, allProjects) {
        if (err) {
            console.log(err); 
            req.flash("error", "Sorry, we've encountered an error trying to render that page.");
            res.redirect("/");
        } else {
            res.render("projects/index", {projects: allProjects});
        }
    });
});

router.post("/", function(req, res) {
    var newProject = req.body.project; 

    Project.create(newProject, function(err, newlyCreated) {
        if (err) {
            console.log(err); 
        } else {
            res.redirect("/projects"); 
        }
    });
});

router.get("/new", function(req, res) {
    res.render("projects/new"); 
});

router.get("/:id", function(req, res) {
    Project.findById(req.params.id, function(err, foundProject) {
        if (err) {
            console.log(err); 
            req.flash("error", "We couldn't find that project"); 
            res.redirect("/projects"); 
        } else {
            res.render("projects/show", {project: foundProject});
        }
    });
});

router.get("/:id/edit", function(req, res) {
    Project.findById(req.params.id, function(err, foundProject) {
        if (err) {
            console.log(err); 
            req.flash("error", "We couldn't find that project"); 
            res.redirect("/projects"); 
        } else {
            res.render("projects/edit", {project: foundProject});
        }
    });
});

router.put("/:id", function(req, res) {
    Project.findByIdAndUpdate(req.params.id, req.body.project, function(err, updatedProject) {
        if (err) {
            console.log(err); 
            req.flash("error", "We couldn't update that project"); 
            res.redirect("/projects");
        } else {
            req.flash("success", "Successfully updated project");
            res.redirect("/projects/" + req.params.id); 
        }
    });
});

router.delete("/:id", function(req, res) {
    Project.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            console.log(err); 
            req.flash("error", "We couldn't delete that project");
            res.redirect("/projects"); 
        } else {
            req.flash("success", "We deleted that project."); 
            res.redirect("/projects"); 
        }
    })
})

module.exports = router;