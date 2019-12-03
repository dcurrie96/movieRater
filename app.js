const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const _movie_database = require("./_movie_database.js");
const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let db = new _movie_database();
app.get('/movies', (req, res)=>{
  output = {'movies': db.get_movies(),'result': 'success'};
  res.send(output);
});
//Movies Routes
app.get('/movies/:mid', (req, res)=>{
  output = {'result': 'success'};
  mid = req.params.mid;
  movie = db.get_movie(mid);
  output = {
    "movie_id": mid,
    "title": movie["movie"][0],
    "genres": movie["movie"][1],
    "img": movie["img"]
  };
  console.log("In app.get movies mid: " + mid + " and movie: " + output['title']);
  res.send(output);
});


//Recommend Routes
app.get('/recommendations/:uid', (req, res)=>{
  output = {'result': 'success'};
  mid = db.get_highest_rated_movie(req.params.uid);
  output['movie_id'] = mid;
  res.send(output);
});

app.post('/recommendations/:uid', (req, res)=>{
  output = {'result': 'success'};
  uid = req.params.uid;
  //console.log("Uid in app.post is " + uid);
  //console.log("Mid in app.post is " + mid);
  data = req.body;
  mid = data["movie_id"];
  rating = data["rating"];
  try{
    db.set_user_movie_rating(uid, mid, rating);
  }
  catch(error){
    output['result'] = 'error';
    output['message'] = String(error);
  }
  res.send(output);
});



app.get('/ratings/:mid', (req,res)=>{
  mid = Number(req.params.mid);
  rating = db.get_rating(mid);
  output = {'result': 'success'};
  output['rating'] = rating.toFixed(1); //Round rating to one decimal place
  output['movie_id'] = mid;
  res.send(output);
});


app.listen(3001, function(){
  console.log("All connected");
});
