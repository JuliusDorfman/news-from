import React, { Component } from 'react'
import Headlines from '../Headlines'
// import PropTypes from 'prop-types'
import './NewsModule.scss'
import axios from 'axios';


let api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

interface Props {
  second?: string;
}

interface State {
  dateToday: string;
  cnnFeed: string[];
  foxFeed: string[];
  nytFeed: string[];
  reutersFeed: string[];
  wordHighlightInput: string[];
  wordHighlightSubmit: string[];
  focusedTerms: string[];
}


export default class NewsModule extends Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props);
    this.state = {
      dateToday: '',
      cnnFeed: [],
      foxFeed: [],
      nytFeed: [],
      reutersFeed: [],
      wordHighlightInput: [],
      wordHighlightSubmit: [],
      focusedTerms: [],
    }
  }
  // static propTypes = {second: third}

  handleTest = () => {
    api.get('/api/cnn')
      .then((response) => {
        let { Feed } = response.data;
        console.log('CNN', response.data.Feed);
        this.setState({ cnnFeed: Feed });
      })
    api.get('/api/fox')
      .then((response) => {
        let { Feed } = response.data;
        console.log('FOX RSS Request', response.data.Feed);
        this.setState({ foxFeed: Feed });
      })
    api.get('/api/nyt')
      .then((response) => {
        let { Feed } = response.data;
        console.log('NYT RSS Request', response.data.Feed);
        this.setState({ nytFeed: Feed });
      })
    api.get('/api/reuters')
      .then((response) => {
        let { Feed } = response.data;
        console.log('Reuters RSS Request', response.data.Feed);
        this.setState({ reutersFeed: Feed });
      })
  }

  handleWordHighlightChange = (e: any) => {
    let { wordHighlightInput } = this.state;
    let { value } = e.target;
    //Allow only letters, numbers, commas, and spaces
    let regex = /^[a-zA-Z0-9, ]*$/;
    if (!regex.test(value)) {
      return;
    }
    //Split the string into an array
    let wordHighlightArray = value.split(',');
    this.setState({ wordHighlightInput: wordHighlightArray });
  }

  handleSubmit = (e: any) => {
    e.preventDefault();
    let { wordHighlightInput } = this.state;
    console.log('Word Highlight', wordHighlightInput);
    //Remove empty strings from array
    for (let i = 0; i < wordHighlightInput.length; i++) {
      if (wordHighlightInput[i] === '') {
        wordHighlightInput.splice(i, 1);
      }
    }
    //Add spaces to beginning and end of each word
    // for (let i = 0; i < wordHighlightInput.length; i++) {
    //   let word = wordHighlightInput[i];
    //   wordHighlightInput[i] = ` ${word} `;
    // }

    //Remove duplicates from array
    let wordHighlightArray = wordHighlightInput.filter((word, index, self) => {
      return index === self.indexOf(word);
    });

    this.setState({ wordHighlightSubmit: wordHighlightArray },
      () => {
        this.setState({ wordHighlightSubmit: wordHighlightInput },
          () => {

            this.setState({ wordHighlightInput: [] });
            //Highlight all words in .headlines__container
            const headlinesContainer = document.getElementsByClassName('.headlines__container');
            if (headlinesContainer) {
              let { wordHighlightSubmit } = this.state;
              for (let i = 0; i < wordHighlightSubmit.length; i++) {
                let word = wordHighlightSubmit[i];
                let wordRegex = new RegExp(word, 'gi');
                let wordHighlight = `<span class="user-highlight">${word}</span>`;
                let headlines = document.getElementsByClassName('headlines__container');
                for (let i = 0; i < headlines.length; i++) {
                  let headline = headlines[i];
                  let headlineText = headline.innerHTML;
                  let newHeadline = headlineText.replace(wordRegex, wordHighlight);
                  headline.innerHTML = newHeadline;
                }
              }
              this.setState({ focusedTerms: wordHighlightSubmit }, () => {
                this.setState({ wordHighlightSubmit: [] });
              })
            }
          })
      })
  };

  componentDidMount = () => {

    //Calculate Today's Date
    let today: any = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    this.setState({ dateToday: today });

    api.get('/api/cnn')
      .then((response) => {
        let { Feed } = response.data;
        // console.log('CNN', response.data.Feed);
        this.setState({ cnnFeed: Feed });
      })
    api.get('/api/fox')
      .then((response) => {
        let { Feed } = response.data;
        // console.log('FOX RSS Request', response.data.Feed);
        this.setState({ foxFeed: Feed });
      })
    api.get('/api/nyt')
      .then((response) => {
        let { Feed } = response.data;
        // console.log('NYT RSS Request', response.data.Feed);
        this.setState({ nytFeed: Feed });
      })
    api.get('/api/reuters')
      .then((response) => {
        let { Feed } = response.data;
        // console.log('Reuters RSS Request', response.data.Feed);
        this.setState({ reutersFeed: Feed });
      })
  }

  render() {
    let { dateToday } = this.state;
    let { cnnFeed } = this.state;
    let { foxFeed } = this.state;
    let { nytFeed } = this.state;
    let { reutersFeed } = this.state;
    let { wordHighlightInput } = this.state;
    let { wordHighlightSubmit } = this.state;
    let { focusedTerms } = this.state;
    return (
      <section id="newsModule" className="newsModule__container">

        <div className="newsModule__table-header">
          <h2 className="newsModule__title">Module-Sources</h2>
          <form
            onSubmit={this.handleSubmit}
            id="word-highlight"
            action="submit">
            <input
              onChange={this.handleWordHighlightChange}
              value={wordHighlightInput}
              placeholder="Search Terms; Comma Seperated"
            ></input>
            <button>Highlight</button>
          </form>
          <div>
            <h3>Focused Terms: </h3>
            <p>{focusedTerms}</p>
          </div>
        </div>

        <div className="newsModule__articles-wrapper">
          <article id="cnn" className="newsModule__article">
            <header>
              <h3 className="newsModule__source">
                CNN
              </h3>
              <h5>{dateToday} Headlines</h5>
            </header>
            <div className="headlines-module-wrapper">
              <Headlines headlines={cnnFeed} />
            </div>
            <footer>
            </footer>
          </article>
          <article id="foxnews" className="newsModule__article">
            <header>
              <h3 className="newsModule__source">
                Fox News
              </h3>
              <h5>{dateToday} Headlines</h5>
            </header>
            <div className="headlines-module-wrapper">
              <Headlines headlines={foxFeed} />
            </div>
            <footer>
            </footer>
          </article>
          <article id="nyt" className="newsModule__article">
            <header>
              <h3 className="newsModule__source">
                New York Times
              </h3>
              <h5>{dateToday} Headlines</h5>
            </header>
            <div className="headlines-module-wrapper">
              <Headlines headlines={nytFeed} />
            </div>
            <footer>
            </footer>
          </article>
          <article id="reuters" className="newsModule__article">
            <header>
              <h3 className="newsModule__source">
                Reuters
              </h3>
              <h5>{dateToday} Headlines</h5>
            </header>
            <div className="headlines-module-wrapper">
              <Headlines headlines={reutersFeed} />
            </div>
            <footer>
            </footer>
          </article>
        </div>
      </section>
    )
  }
}
