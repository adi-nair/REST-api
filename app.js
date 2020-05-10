const bodyParser = require ("body-parser");
const mongoose = require('mongoose');
const ejs = require("ejs");
const express = require("express");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/wikiDB",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article",articleSchema);

/////////////////////////////////////////////REQUESTS FOR ALL ARTICLES //////////////////////////////////
app.route("/articles")

.get(function(req,res){
  Article.find(function(err, foundArticles){
    if(err){
      res.send(err);
    }
    else{
      res.send(foundArticles);
    }

  });
})

.post(function(req,res){
  console.log(req.body.title);
  console.log(req.body.content);

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function(err){
    if(!err){
      res.send("successfully added");
    }
    else{
      res.send("there was an error");
    }
  });
})

.delete(function(req,res){
  Article.deleteMany(function(err){
    if(!err){
      res.send("successfully deleted");
    }
    else{
      res.send("there was an error");
    }
  });
});

///////////////////////////////////////REQUESTS FOR SPECIFIC ARTICLE ///////////////////////////

app.route("/articles/:articleTitle")

.get(function(req,res){

  Article.findOne({title: req.params.articleTitle},function(err,foundTitle){
    if(foundTitle){
      res.send(foundTitle);
    }
    else{
      res.send("No matching titles.found");
    }
  });
})

.put(function(req,res){

  Article.update(
    {title: req.params.articleTitle}, //what to find
    {title:req.body.title, content:req.body.content},//what to change
    {overwrite:true}, //overwrites everything and ONLY updates the said fields
    function(err){
      if (!err){
        res.send("Article updated");
      }
    });
})

.patch(function(req, res) {
  Article.update(
    {title: req.params.articleTitle},
    {$set: req.body}, //req.body will only have the things that need to be changed
    function(err) {
      if (!err) {
        res.send("successfully updated field(s)");
      };
    }
  );
})

.delete(function(req,res){
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err){
      if(!err){
        res.send("successfully deleted ");
      }
    });
});


app.listen(3000,function(){
  console.log("Server is running on port 3000")
});
