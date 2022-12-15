const path = require('path');
const express = require('express');
const router = express.Router();
require('dotenv').config({path: path.join(__dirname, '/.env')});




module.exports = router;