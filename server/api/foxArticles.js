const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Feed = require('rss-to-json');

// Article Model
const Article = require('../../models/Article.js');

// @Route GET routes/api/foxAticles/
// @Desc GET all articles with {site: "fox"}
// @Access Public
router.get('/', (req, res) => {
    Article.find({site: "fox"})
        .sort({ created: -1 })
        // http calls are only made in strings (the network) so res.json is serializing the data into json turning that object into a string so that when deserialized able to turn into an object
        .then(articles => res.json(articles))
        .catch(err =>
            res.status(404).json({ noarticlesfound: 'No articles found' })
        );
});

// @Route POST /routes/api/foxArticles/
// @Desc POST to db.Articles new articles from fox
// @Access Public
// 'http://feeds.foxnews.com/foxnews/politics'

//TODO: REFACTOR AND OPTIMIZE 

router.post('/', (req, res) => {
  const articleArray = [];
  const articleJSON = [];

  Feed.load('http://feeds.foxnews.com/foxnews/politics', function(err, rss) {
    rss.items.map((rssArticles, index) => {
      const newArticle = new Article({
        title: rssArticles.title,
        site: 'fox',
        created: rssArticles.created,
        url: rssArticles.url
      });
      articleArray.push(newArticle);
    });

    articleArray.forEach((rssResult, index) => {
      Article.findOne({ title: rssResult.title }, (err, dbResult) => {
        if (!dbResult) {
          console.log("NEW ENTRY");
          rssResult.save()
          articleJSON.push(rssResult)
        } else {
          console.log("DUPLICATE")
        }
      }).then(result => {

        return res.json(result)
      })
    });
  });
});

module.exports = router;