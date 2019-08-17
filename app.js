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
	const filePath = '/Users/tug/302/music/music-frequency-d3/audio/Odesza - Above The Middle.mp3';
	// get file size info
	const stat = fs.statSync(filePath);
  
	// set response header info
	res.writeHead(200, {
	  'Content-Type': 'audio/mpeg',
	  'Content-Length': stat.size
	});

	//create read stream
	const readStream = fs.createReadStream(filePath);
	// attach this stream with response stream
	readStream.on('open', function () {
		// This just pipes the read stream to the response object (which goes to the client)
		console.log(res)
    readStream.pipe(res);
  });
  });

//register api calls
app.use('/api/v1/', api);

// send react app on / GET
app.use(express.static(path.resolve(__dirname, './public/build/')));
app.use(express.static(path.resolve(__dirname, './public/assets/')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/build/', './index.html'));
});

const server = http.createServer(app);
const io = require('socket.io').listen(server, {
  log: false,
  agent: false,
  origins: '*:*',
  transports: ['websocket', 'htmlfile', 'xhr-polling', 'jsonp-polling', 'polling']
});

io.on('connection', client => {

  const stream = ss.createStream();

  client.on('track', () => {
    const filePath = path.resolve(__dirname, './private', './track.wav');
    const stat = fs.statSync(filePath);
    const readStream = fs.createReadStream(filePath);
    // pipe stream with response stream
		readStream.pipe(stream);
		console.log('test')

    ss(client).emit('track-stream', stream, { stat });
  });
  client.on('disconnect', () => {});
});

server.listen(process.env.PORT || '3001', function () {
  console.log('Server app listening on port 3001!');
});
