function changeText(args){
  console.log("Change text was called!");
  var xhr = new XMLHttpRequest();
  var rateReq = new XMLHttpRequest();
  var imgReq = new XMLHttpRequest();
  var imageAddr = "";
  var getRec = new XMLHttpRequest();
  getRec.open('GET', 'http://localhost:3001/recommendations/149', true);
  //After getRec called, then xhr and rateReq are called
  getRec.onload = function(e){
    if(getRec.readyState == 4){
      console.log("BEGIN REC RESP");
      console.log(getRec.responseText);
      var recommendation = JSON.parse(getRec.responseText);
      mid = recommendation['movie_id'];
      console.log("Your movie is:");
      console.log(mid);
      console.log("END REC RESP");
      xhr.open('GET', 'http://localhost:3001/movies/'+ mid, true);
      rateReq.open('GET', 'http://localhost:3001/ratings/'+ mid, true);
      xhr.send(null);
      rateReq.send(null);
    }
    else{
      console.error(xhr.statusText);
    }
  }
  xhr.onload = function(e){
    if(xhr.readyState == 4){
      var obj = JSON.parse(xhr.responseText);
      args[0].setText(obj['title']);
      imageAddr = 'https://www3.nd.edu/~cmc/teaching/cse30332/images' + obj['img'];
      args[2].changeImage(imageAddr);
    }
    else{
      console.error(xhr.statusText);
    }
  }

  rateReq.onload = function(e){
    if(rateReq.readyState == 4){
      var rating  = JSON.parse(rateReq.responseText);
      args[1].setText("Avg Rating: " + rating['rating'] + "/5.0");
      console.log("YOUR RATING IS:");
      console.log(rating['rating']);
    }
    else{
      console.error(rateReq.statusText);
    }
  }

  getRec.send(null);
  //xhr.send(null);
  //rateReq.send(null);
}

function sendVote(args){
  console.log("Send vote was called!");
  var xhr = new XMLHttpRequest();
  var rating = args[3];
  console.log("The rating you have given is: " + rating);
  var payload = {'movie_id': mid, 'rating': rating};
  xhr.open('POST', 'http://localhost:3001/recommendations/149', true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.onload = function(e){
    if(xhr.readyState == 4){
      console.log("Success!");
      console.log(xhr.responseText);
      changeText(args);
    }
    else{
      console.error(xhr.statusText);
    }
  }

  console.log(`HERE IS THE PAYLOAD: ${JSON.stringify(payload)}`);
  xhr.send(JSON.stringify(payload));
}
var mid = 0;

Label.prototype = new Item();
label = new Label();
label.createLabel("which movie?", "theLabel");

rating = new Label();
rating.createLabel("", "theRating");

Image.prototype = new Item();
image = new Image();
image.createImage("");

Button.prototype = new Item();

argsLike = [ label, rating, image , 5];
argsDislike = [ label, rating, image, 1];
upvote = new Button();
upvote.createButton("Like", "like");
upvote.addClickEventHandler(sendVote, argsLike);

downvote = new Button();
downvote.createButton("Dislike", "dislike");
downvote.addClickEventHandler(sendVote, argsDislike);


label.addToDocument();
upvote.addToDocument();
downvote.addToDocument();
//button.addToDocument();
image.addToDocument();
rating.addToDocument();

changeText(argsLike);
