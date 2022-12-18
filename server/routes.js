const path = require("path");
const express = require("express");
const app = express();
const router = express.Router();
const axios = require("axios");
const rssParser = require("rss-parser");
require("dotenv").config({ path: path.join(__dirname, "../", ".env") });


const parser = new rssParser();

router.get("/cnn", async (req, res) => {
  try {
    const response = await parser.parseURL(process.env.CNN_FEED_URL);
    res.json({Feed: response.items});
  } catch (error) {
    res.send("Error getting CNN RSS feed");
  }
});

router.get("/fox", async (req, res) =>{
  try {
    const response = await parser.parseURL(process.env.FOX_FEED_URL);
    res.json({Feed: response.items});
  } catch (error) {
    res.send("Error getting FOX RSS feed");
  }
})

router.get("/nyt", async (req, res) =>{
  try {
    const response = await parser.parseURL(process.env.NYT_FEED_URL);
    res.json({Feed: response.items});
  } catch (error) {
    res.send("Error getting NYT RSS feed");
  }
})

router.get("/reuters", async (req, res) =>{
  try {
    const response = await parser.parseURL(process.env.REUTERS_FEED_URL);
    res.json({Feed: response.items});
  } catch (error) {
    res.send("Error getting REUTERS RSS feed");
  }
})

module.exports = router;
