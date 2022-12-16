const path = require("path");
const express = require("express");
const app = express();
const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Hello World!");
});

module.exports = router;
