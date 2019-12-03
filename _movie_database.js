const fs = require('fs');
const readline = require('readline');

class _movie_database{
  constructor(){
    this.movies = this.load_movies();
    this.images = this.load_images();
    this.ratings = this.load_ratings();
    this.users = this.load_users();
  }
  load_movies(){
    var movies = {};
    var text = fs.readFileSync('movies.dat').toString().split('\n');
    text.forEach(function(line){
      var fields = line.split("::");
      fields[0] = Number(fields[0]);
      movies[fields[0]] = [fields[1], fields[2]];
    });
    delete movies["0"]; //Undefined
    //console.log(movies); //Last item is undefined for some reason
    return movies;
  }
  load_images(){
    var images = {};
    var text = fs.readFileSync('images.dat').toString().split('\n');
    text.forEach(function(line){
      var fields = line.split("::");
      images[Number(fields[0])] = fields[2]; //Path to image
    });
    //images.pop();
    return images;

  }
  get_image_by_mid(mid){
    if (mid in this.images){
      return this.images[mid];
    }
  }
  get_movie(mid){
    if (mid in this.movies){
      return {"movie": this.movies[mid], "img": this.images[mid]};
    }
  }
  get_movies(){
    var movList = [];
    var movKeys = Object.keys(this.movies);
    for (var i = 0; i<movKeys.length; i++){
      movList.push(movKeys[i]);
    }
    return movList;
  }
  set_movie(mid, movieInfo){
    this.movies[mid] = movieInfo;
  }
  delete_movie(mid){
    delete this.movies[mid];
  }
  get_user(uid){
    return this.users[uid];
  }
  set_user(uid, userInfo){
    this.users[uid] = userInfo
  }
  next_user(){ //Next available user id
    maximum = Object.keys(this.users).length;
    return maximum+1;
  }
  get_users(){
    var userList = [];
    var userKeys = Object.keys(this.users);
    for (var i=0; i<userKeys.length; i++){
      userList.push(userKeys[i]);
    }
    return userList;
  }
  delete_user(uid){
    delete this.users[uid];
  }
  load_users(){
    var users = {};
    var text = fs.readFileSync('users.dat').toString().split('\n');
    text.forEach(function(line){
      var fields = line.split("::");
      users[fields[0]] = [fields[1], fields[2], fields[3], fields[4]];
    });
    //users.pop();
    return users;
  }
  load_ratings(){
    var ratings = {};
    var text = fs.readFileSync('ratings.dat').toString().split('\n');
    text.forEach(function(line){
      var fields = line.split("::");
      var uid = fields[0];
      var mid = fields[1];
      if (mid in ratings){
        ratings[mid][uid] = fields[2];
      }else{
        ratings[mid] = {};
        ratings[mid][uid] = fields[2];
      }
    });
    //ratings.pop();
    return ratings;
  }
  next_mid(){
    return Math.max(...Object.keys(this.movies)) + 1;
  }
  get_rating(mid){
    var total = 0;
    var values = Object.values(this.ratings[mid]);
    //console.log(values);
    for(var key in this.ratings[mid]){
      total += Number(this.ratings[mid][key]);
    }
    var rateNum = Object.values(this.ratings[mid]).length;
    return total/rateNum;
    //return (total/rateNum).toFixed(2); //Round avg ratings to two decimal spots
  }
  get_user_movie_rating(uid, mid){
    if (uid in this.ratings[mid]){
      return this.ratings[mid][uid];
    }
    else{
      return null;
    }
  }
  set_user_movie_rating(uid, mid, rating){
    this.ratings[mid][uid] = rating;
  }
  get_highest_rated_movie(uid){//returns highest rated movie user has not voted yet
    var myRatings = Array();
    for (var mid in this.ratings){
      if (Number.isNaN(this.get_rating(mid))){
        continue;
      }
      else{
        var entry = [mid, Number(this.get_rating(mid)).toFixed(2)]; //Take max from pile, delete from pile after
        myRatings.push(entry);
      }
    }
    var sortedRatings = myRatings.sort((a, b)=>{return b[1]-a[1]}); //Sort by second item in descending order
    //To do: find max rating, check if user has voted it yet -- if not, return that mid
    for (var movie=0; movie<sortedRatings.length; movie++){
      var top = sortedRatings[movie][0];
      if(!(uid in this.ratings[top])){ //User has not rated particular movie yet
        return top;
      }else {
        continue;
      }
    }
  }
  delete_all_ratings(){
    this.ratings = {};
  }
}

module.exports = _movie_database;
//var db = new _movie_database();

//db.get_highest_rated_movie();
//console.log(db.next_mid());
