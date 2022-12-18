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
  cnnFeed: string[];
  foxFeed: string[];
  nytFeed: string[];
  reutersFeed: string[];
}


export default class NewsModule extends Component<Props, State> {
  constructor(props: Props, state: State) {
    super(props);
    this.state = {
      cnnFeed: [],
      foxFeed: [],
      nytFeed: [],
      reutersFeed: [],
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

  componentDidMount = () => {
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

  render() {
    let { cnnFeed } = this.state;
    let { foxFeed } = this.state;
    let { nytFeed } = this.state;
    let { reutersFeed } = this.state;
    return (
      <section className="newsModule__container">
        <h2 className="newsModule__title">Data-Sources</h2>
        <span>
          {/* <button onClick={() => this.handleTest()}>button</button> */}
        </span>
        <article id="cnn" className="newsModule__article">
          <header>
            <h3 className="newsModule__source">
              CNN
            </h3>
            <h5>Headlines</h5>
          </header>
          <main>
            <Headlines headlines={cnnFeed} />
          </main>
          <footer>
          </footer>
        </article>
        <article id="foxnews" className="newsModule__article">
          <header>
            <h3 className="newsModule__source">
              Fox News
            </h3>
            <h5>Headlines</h5>
          </header>
          <main>
            <Headlines headlines={foxFeed} />
          </main>
          <footer>
          </footer>
        </article>
        <article id="nyt" className="newsModule__article">
          <header>
            <h3 className="newsModule__source">
              New York Times
            </h3>
            <h5>Headlines</h5>
          </header>
          <main>
            <Headlines headlines={nytFeed} />
          </main>
          <footer>
          </footer>
        </article>
        <article id="reuters" className="newsModule__article">
          <header>
            <h3 className="newsModule__source">
              Reuters
            </h3>
            <h5>Headlines</h5>
          </header>
          <main>
            <Headlines headlines={reutersFeed} />
          </main>
          <footer>
          </footer>
        </article>
      </section>
    )
  }
}
