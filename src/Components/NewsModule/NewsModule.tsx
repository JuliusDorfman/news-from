import React, { Component } from 'react'
import Headlines from '../Headlines'
// import PropTypes from 'prop-types'
import './NewsModule.scss'

export default class NewsModule extends Component {
  // static propTypes = {second: third}

  render() {
    return (
      <section className="newsmodule__container">
        <article id="cnn" className="newsmodule__article">
          <header>
            <h2>
              CNN
            </h2>
          </header>
          <main>
            <Headlines />
          </main>
          <footer>

          </footer>
        </article>
        <article id="foxnews" className="newsmodule__article">
          <header>
            <h2>
              Fox News
            </h2>
          </header>
          <main>
            <Headlines />
          </main>
          <footer>

          </footer>
        </article>
        <article id="breitbart" className="newsmodule__article">
          <header>
            <h2>
              Brietbart
            </h2>
          </header>
          <main>
            <Headlines />
          </main>
          <footer>

          </footer>
        </article>
        <article id="msnbc" className="newsmodule__article">
          <header>
            <h2>
              MSNBC
            </h2>
          </header>
          <main>
            <Headlines />
          </main>
          <footer>

          </footer>
        </article>
      </section>
    )
  }
}
