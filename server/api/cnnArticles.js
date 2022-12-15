const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Feed = require('rss-to-json');

// Article Model
const Article = require('../../models/Article.js');

// @Route Post routes/api/cnnArticles/test
// @Desc post to db for testing purposes
// @Access Public
router.post('/test', (req, res) => {
  const articleJSON = [];
  Feed.load('http://rss.cnn.com/rss/cnn_topstories.rss', function(
    err,
    rssArticles
  ) {
    rssArticles.items.map((articles, index) => {
      var newArticle = new Article({
        title: articles.title,
        site: 'cnn',
        created: articles.created,
        url: articles.url
      });

      newArticle.save().then(articleItems => {
        console.log('NEW dbArticle', articleItems.title);
        articleJSON.push(articleItems);
        return res.json(articleItems);
      });
    });
  });
});

// @Route GET routes/api/cnnArticles/
// @Desc GET all articles with {site: "cnn"}
// @Access Public
router.get('/', (req, res) => {
  Article.find({ site: 'cnn' })
    .sort({ created: -1 })
    // http calls are only made in strings (the network) so res.json is serializing the data into json turning that object into a string so that when deserialized able to turn into an object
    .then(articles => res.json(articles))
    .catch(err =>
      res.status(404).json({ noarticlesfound: 'No articles found' })
    );
});

// @Route POST /routes/api/cnnArticles/
// @Desc POST to db.Articles new articles from cnn
// @Access Public
// 'http://rss.cnn.com/rss/cnn_topstories.rss'

//TODO: REFACTOR AND OPTIMIZE 

router.post('/', (req, res) => {
  const articleArray = [];
  const articleJSON = [];

  Feed.load('http://rss.cnn.com/rss/cnn_topstories.rss', function(err, rss) {
    rss.items.map((rssArticles, index) => {
      const newArticle = new Article({
        title: rssArticles.title,
        site: 'cnn',
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

// Article.find({}, (err, dbArticle) => {
//   articleArray.forEach((newArticle, index) => {
//     console.log('insideFIND()', dbArticle[index].title);
//     if (dbArticle[index].title) {
//       console.log('insideIF');
//       Article.findOne({ title: newArticle.title }, (err, dbArticle) => {
//         if (newArticle.title === dbArticle.title) {
//           console.log('DUPLICATE dbArticle', dbArticle.title + index);
//           console.log('DUPLICATE newArticle', newArticle.title + index);
//         } else {
//           newArticle.save()
//             .then(articleItems => {
//               console.log("NEW dbArticle", articleItems.title)
//               articleJSON.push(articleItems)
//             })
//         }
//       });
//     } else {
//       console.log('insideELSE');
//       newArticle.save()
//         .then(articleItems => {
//           console.log("NEW dbArticle", articleItems.title)
//           articleJSON.push(articleItems)
//           return res.json(articleJSON)
//         })
//     }
//   });
// });