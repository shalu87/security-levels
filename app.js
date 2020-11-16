//jshint esversion:6
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser =require("body-parser");
const mongoose= require("mongoose");
var encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

var userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET ,encryptedFields: ['password']});

var User = new mongoose.model('User', userSchema );

app.get("/",function(req,res){
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
});
app.get("/login",function(req,res){
  res.render("login");
});

app.post("/register",function(req,res){
  email=req.body.username;
  password=req.body.password;

  var user = new User ({
    email: email,
    password: password
  });

user.save(function(err){
  if(err){
    console.log(err);
  }else{
    res.render("secrets");
  }
});
});

app.post("/login",function(req,res){

  User.findOne({email: req.body.username},function(err,foundUser){
    if(err){
        console.log("No user found");
      }else{
        if(foundUser){
          if(foundUser.password === req.body.password)
        {
            res.render("secrets");
          }else{
            console.log("password doesn't match");
      }
    } else{
      console.log("no user found");
    }
  }
  });
});





app.listen(3000, function(){
  console.log(' app listening on port 3000!');
});
