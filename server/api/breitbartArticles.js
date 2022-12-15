const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Feed = require('rss-to-json');

// Article Model
const Article = require('../../models/Article.js');

// @Route GET routes/api/breitbartArticles/
// @Desc GET all articles with {site: "breitbart"}
// @Access Public
router.get('/', (req, res) => {
  Article.find({ site: 'breitbart' })
    .sort({ created: -1 })
    // http calls are only made in strings (the network) so res.json is serializing the data into json turning that object into a string so that when deserialized able to turn into an object
    .then(articles => res.json(articles))
    .catch(err =>
      res.status(404).json({ noarticlesfound: 'No articles found' })
    );
});

// @Route POST /routes/api/breitbartArticles/
// @Desc POST to db.Articles new articles from breitbart
// @Access Public
// 'http://feeds.feedburner.com/breitbart'

//TODO: REFACTOR AND OPTIMIZE

router.post('/', (req, res) => {
  const articleArray = [];
  const articleJSON = [];

  Feed.load('http://feeds.feedburner.com/breitbart', function(err, rss) {
    rss.items.map((rssArticles, index) => {
      const newArticle = new Article({
        title: rssArticles.title,
        site: 'breitbart',
        created: rssArticles.created,
        url: rssArticles.url
      });
      articleArray.push(newArticle);
    });

    articleArray.forEach((rssResult, index) => {
      Article.findOne({ title: rssResult.title }, (err, dbResult) => {
        if (!dbResult) {
          console.log('NEW ENTRY');
          rssResult.save();
          articleJSON.push(rssResult);
        } else {
          console.log('DUPLICATE');
        }
      }).then(result => {
        return res.json(result);
      });
    });
  });
});

module.exports = router;

// @Route POST /routes/api/breitbartArticles/
// @Desc POST to db.Articles new articles from breitbart
// @Access Public
// router.post('/', (req, res) => {
//   const fetchRss = new Promise((resolve, reject) => {
//     Feed.load('http://feeds.feedburner.com/breitbart', (err, rss) => {
//       resolve(rss.items);
//     });
//   });

//   Promise.all([fetchRss])
//     .then(rssObject => {
//       rssObject[0].forEach((rssArticles, index) => {
//         const newArticle = new Article({
//           title: rssArticles.title,
//           site: 'breitbart',
//           created: rssArticles.created,
//           url: rssArticles.url
//         });
//         newArticle
//           .save()
//           .then(articleItem => {
//             return res.json(articleItem);
//           })
//           .catch(error =>
//             res
//             .status(404)
//             .json({ newArticle_error: 'POST ERROR: ' + error })
//           );
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// });
