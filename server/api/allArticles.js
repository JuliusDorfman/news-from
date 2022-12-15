const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Article = require('../../models/Article.js');

// @Route GET /routes/api/allArticles/:searchword
// @Desc GET to db.Articles for matching [:searchword] in Article.title
// @Access Public

// "Robert F. Kennedy Jr. says he’s not convinced Sirhan Sirhan killed his dad"
router.get('/searchword/:searchword', (req, res) => {
	const query = req.params.searchword;
	Article.find({}, {'title': 1, 'site': 1, 'url': 1, '_id': 0})
		.then(result => {
			let returnArray = [];
			for (let i = 0; i < result.length; i++) {
				let tempString = result[i].title
				let wordMatch = tempString.includes(query);
				if (wordMatch){
					returnArray.push(result[i])
				}
			}
			return res.json(returnArray)
		})
		.catch(err =>
			res.status(404).json({noarticlefound: "No Article Found"}))
});

module.exports = router;
