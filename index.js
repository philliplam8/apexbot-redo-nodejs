var request = require('request'); // "Request" library
var express = require('express');
var cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

var app = express();

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

app.get('/', async (_, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Connected successfully!',
    });
})