import React, { Component} from 'react';
import './App.css';
//Port for fetch requests: 3001
//One goal: get a title displayed.
//Create component for title: make fetch request in there following Medium article

class App extends Component {
  constructor(){
    super();
    this.state = {
      movie: '',
      image: '',
      rating: '',
      userRating: '',
    };
  }

  async doTheRequest(){
    //Fetch Movie Here!
    //For movie, rating, and image: fetch, then .json(), then JSON.stringify
    const response = await fetch('http://localhost:3001/recommendations/149')
    const myJson = await response.json();
    const mid = await myJson.movie_id;
    const myMovie = await fetch(`http://localhost:3001/movies/${mid}`);
    const myRating = await fetch(`http://localhost:3001/ratings/${mid}`);
    const movieJson = await myMovie.json();
    const ratingJson = await myRating.json();
    this.setState({
      mid: mid,
      movie: movieJson.title,
      image: `https://www3.nd.edu/~cmc/teaching/cse30332/images${movieJson.img}`,
      rating: ratingJson.rating
    });
    console.log(this.state);
  }
  async sendVote(e){
    const userRating = (e.currentTarget.id === 'like' ? 5 : 0);
    const data = {
      'movie_id': this.state.mid,
      'rating': userRating
    }
    const response = await fetch('http://localhost:3001/recommendations/149', {
                                method: 'POST',
                                mode: 'cors',
                                credentials: 'same-origin',
                                headers: {
                                  'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data),
    });
    //Trigger re-render
    this.setState({
      mid: '',
      movie: '',
      image: '',
      rating: ''
    });

  }
  render(){
    this.doTheRequest();
    document.body.style = 'background: linear-gradient(to right, #19ff79, #59ffdb)';
    return(
      <div className='myCenter'>
        <p className='f2'>{this.state.movie}</p>
        <div className='neatRow'>
          <button onClick={(e) => this.sendVote(e)} className='ma3' id='like'><i className="f1 fa fa-thumbs-up"></i></button>
          <img className='br2 shadow-5 grow' src={this.state.image} />
          <button onClick={(e) => this.sendVote(e)} className='ma3' id='dislike'><i className="f1 fa fa-thumbs-down"></i></button>
        </div>
        <p className='tc f3'>Rating: {this.state.rating}/5.0</p>
      </div>
    )
  }

}

export default App;
