import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Parser from 'rss-parser';
import Spinner from '../Spinner/Spinner';
// import newsFromLogo from '../../Assets/news-from-logo.png';
// import PropTypes from 'prop-types';
import './Headlines.scss';


interface Headline {
  title: string;
  link: string;
  // pubDate: string;
  content: string;
  contentSnippet: string;
  guid: string;
  // isoDate: string;
}

function Headlines(props: { headlines: Headline[] }) {
  if (props.headlines && props.headlines.length > 0) {
    return (
      <div className="headlines__component">
        <ul className="headlines__container">
          {props.headlines.map((headlines, index) => (
            <li className="headlines__wrapper" key={index}>
              <div className="headlines__category">
                <h6></h6>
              </div>
              <div className="headlines__headline">
                <h6>&#8250; &nbsp; {`${headlines.title}`}</h6>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }
  return (
    <div>
      <Spinner />
    </div>
  )
}


export default Headlines
