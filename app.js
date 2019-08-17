require('dotenv').config()
const bodyParser = require('body-parser')
const express = require('express');
const app = express()
const fs = require('fs');
const http = require('http');
const ss = require('socket.io-stream');
const path = require('path');
const api = express();


app.get('/test', (req, res) => {
	res.render('test')
})

app.get('/track', (req, res, err) => {
	// generate file path/Users/tug/302/music/music-frequency-d3/audio/Odesza - Above The Middle.mp3
	const filePath = __dirname + '/raw/Odesza - Above The Middle.mp3';
	// get file size info
	const stat = fs.statSync(filePath);

	console.log(stat)
  
	// set response header info
	res.writeHead(200, {
	  'Content-Type': 'audio/mpeg',
	  'Content-Length': stat.size
	});

	//create read stream
	const readStream = fs.createReadStream(filePath);
	// attach this stream with response stream
	readStream.pipe(res);
  });
