import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Parser from 'rss-parser';
import PropTypes from 'prop-types';
import './Headlines.scss';


type CustomFeed = { foo: string };
type CustomItem = { bar: number };



Headlines.propTypes = {

}

function Headlines(props: any) {

  // const [headlines, setHeadlines] = useState([[], [], [], []]);
  // let parser: Parser<CustomFeed, CustomItem> = new Parser({
  //   customFields: {
  //     feed: ['foo'],
  //     //            ^ will error because `baz` is not a key of CustomFeed
  //     item: ['bar']
  //   }
  // });

  // let parseRss = (data: any) => {
  //   let items = data.items;
  //   let feed = data.feed;
  //   let parsed = {
  //     items: items,
  //     feed: feed
  //   }
  //   return parsed;
  // }


  // useEffect(() => {
  //   const fetchData = async () => {
  //     // Fetch and parse data from each RSS feed
  //     const cnnResponse = await axios.get(String(process.env.CNN_FEED_URL));
  //     const foxResponse = await axios.get(String(process.env.FOX_FEED_URL));
  //     const nytResponse = await axios.get(String(process.env.NYT_FEED_URL));
  //     const reutersResponse = await axios.get(String(process.env.REUTERS_FEED_URL));

  //     const cnnData = cnnResponse.data;
  //     const foxData = foxResponse.data;
  //     const nytData = nytResponse.data;
  //     const reutersData = reutersResponse.data;

  //     // Extract headlines from parsed data
  //     const cnnHeadlines = parseRss(cnnData).items;
  //     const foxHeadlines = parseRss(foxData).items;
  //     const nytHeadlines = parseRss(nytData).items;
  //     const reutersHeadlines = parseRss(reutersData).items;

  //     // Update component's state with fetched headlines
  //     setHeadlines([cnnHeadlines, foxHeadlines, nytHeadlines, reutersHeadlines]);
  //   };

  //   fetchData();
  // }, []);




  return (
    <div className="headlines">
      <h4>Headlines</h4>
      <ul>
        {/* map here */}
      </ul>
    </div>
  )
}


export default Headlines
