var mongoose = require("mongoose"); 

var projectSchema = new mongoose.Schema({
    name: String, 
    url: String, 
    github: String, 
    description: String, 
    myRole: String
});

var Project = mongoose.model("Project", projectSchema); 

module.exports = Project;