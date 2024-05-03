const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articalSchema = {
    title:String,
    content: String
};

const Article = mongoose.model("Article", articalSchema);

app.get("/articles",function(req,res){
    Article.find()
    .then(foundArticles => {
        if (!foundArticles) {
          // Handle case where post is not found
          res.status(404).send("Post not found");
          return;
        }
        
       res.send(foundArticles)
      })
      .catch(err => {
        // Handle any errors that occurred during the query
        console.error("Error finding post:", err);
        res.status(500).send("Internal Server Error");
      });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});