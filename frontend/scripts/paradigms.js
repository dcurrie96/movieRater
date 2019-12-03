function Item(){
  this.addToDocument = function(){
    document.body.appendChild(this.item);
  }
};

function Label(){
  this.createLabel = function(text, id){
    this.item = document.createElement("p");
    this.item.setAttribute("id", id);
    this.item.innerHTML = text;
  },
  this.setText = function(text){
    this.item.innerHTML = text;
  }
};

function Button(){
  this.createButton = function(text, id){
    this.item = document.createElement("button");
    this.item.setAttribute("id", id);
    this.item.innerHTML = text;
  },
  this.addClickEventHandler = function(handler, args){
    this.item.onmouseup=function(){
      handler(args);
    }
  }
};

function Image(){
  this.createImage = function(src){
    this.item = document.createElement("img");
    this.item.setAttribute("src", src);
  },
  this.changeImage = function(src){
    this.item.src = src;
  }
};
