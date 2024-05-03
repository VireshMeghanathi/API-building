const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//database connect and schema
mongoose.connect("mongodb://localhost:27017/wikiDB");

const articalSchema = {
  title: String,
  content: String,
};

const Article = mongoose.model("Article", articalSchema);

// routs 

app.route("/articles")
.get(function (req, res) {
  Article.find()
    .then((foundArticles) => {
      if (!foundArticles) {
        res.status(404).send("Post not found");
        return;
      }

      res.send(foundArticles);
    })
    .catch((err) => {
      console.error("Error finding post:", err);
      res.status(500).send("Internal Server Error");
    });
})
.post(function (req, res) {
  const newArtical = new Article({
    title: req.body.title,
    content: req.body.content,
  });
  newArtical.save()
    .then((savedArticle) => {
      res.send("successfully added new artical");
    })
    .catch((err) => {
      res.status(500).send("Error occurred while saving the article.");
    });
})
.delete(function(req,res){
  Article.deleteMany()
  .then(()=>{
    res.send("successfully deleted all articals");
  })
  .catch((err)=>{
    res.status(500).send("Error occurred while deleting the article.");
  })
});


// //////////////////////////////// Requesting Targeting Specific Artical //////////////////////////////
app.route("/articles/:articleTitle")
.get(function(req,res){
  Article.findOne({title:req.params.articleTitle})
  .then((foundArticles)=>{
    if(!foundArticles){
      res.status(404).send("Article not found");
      return;
    }
    res.send(foundArticles);
  })
  })

.put(function(req,res){
  Article.updateOne(
    {title:req.params.articleTitle},
    {title:req.body.title,content:req.body.content},
    {overwrite:true},
    function(err){
      if(!err){
        res.send("successfully updated the article");
      }
    }
  );
})

.patch(function(req,res){
   Article.updateOne(
    { title: req.params.articleTitle },
    { $set: req.body }
  )
    .then(() => {
      res.send("successfully updated the article");
    })
    .catch((err) => {
      res.status(500).send("Error occurred while updating the article.");
    });
})

.delete(function(req,res){
  Article.deleteOne({title:req.params.articleTitle})
    .then(() => {
      res.send("successfully deleted the article");
    })
    .catch((err) => {
      res.status(500).send("Error occurred while deleting the article.");
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
