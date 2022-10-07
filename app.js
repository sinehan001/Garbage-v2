const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
let cookieParser = require('cookie-parser');

var session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const app = express();
let uname = "";

require('dotenv').config();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
app.use(cookieParser());

app.use(session({
  secret: "success",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGODB_URI);

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  secret: String,
  refrate: Number
}, 
{ collection : 'Users' });

const userSchema1 = new mongoose.Schema({
  _id: String,
  floor: String,
  garbage: String,
  status: String
}, 
{ collection : 'Garbage' });

userSchema.plugin(passportLocalMongoose);


const User = mongoose.model("User", userSchema)
const Garbage = mongoose.model("Garbage", userSchema1)

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res) {
  res.render("register");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});

app.get("/home", function(req, res) {
  if (req.isAuthenticated()) {
    let refrate = 10000;
    User.find({username: uname}, function (err, docs) {
      if (err){
          console.log(err);
      }
      else{
        refrate = docs[0].refrate;
        res.render('index',{refresh: refrate});
      }
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/data", function(req, res) {
  if (req.isAuthenticated()) {
    Garbage.find({}, function (err, docs) {
      if (err){
          console.log(err);
      }
      else{
        res.send(docs);
      }
    }).sort({floor: 1, garbage: 1});
  } else {
    res.redirect("/login");
  }
});

app.get("/footer1", function(req, res) {
  res.render("footer1");
});

app.get("/submit", function(req, res) {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});

app.get("/editprofile", function(req, res) {
  if (req.isAuthenticated()) {
    res.render('editprofile',{img: 'images/bg1.jpg'});
  } else {
    res.redirect("/login");
  }
});

app.get('/editprofile', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/editprofile');
  });
});

app.get('/logout', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/');
  });
});


app.post("/register", function(req, res) {
  console.log(req.body.username);
  console.log(req.body.password);
  User.register({
    username: req.body.username,
    refrate: 30000,
  }, req.body.password, function(err, user) {
    if (err) {
      res.cookie("alert", 1);
      res.redirect("/register");
    } else {
      passport.authenticate("local")(req, res, function() {
        uname = req.body.username;
        res.cookie("uname", req.body.username);
        res.cookie("token", req.body.password);
        res.redirect("/home");
      });
    }
  })

});
app.post("/login", function(req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, function(err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function() {
        uname = req.body.username;
        res.redirect("/home");
      })
    }
  });
});

app.post('/refresh', function(req, res) {
  console.log(req.body.rate);
  User.updateOne({username: uname}, {$set: {refrate: req.body.rate}}, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
  });
  res.redirect('/home');
})

app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
