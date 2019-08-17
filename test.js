const express = require('express');
const app = express();
const api = express();
const http = require('http');
const fs = require('fs');

const getAudioContext = () => {
    AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
  
    return { audioContext, analyser };
  };
  

const loadFile = (url, { frequencyC, sinewaveC }) => new Promise(async (resolve, reject) => {
const response = await axios.get(url, {  responseType: 'arraybuffer' });
const { audioContext, analyser } = getAudioContext();
const audioBuffer = await audioContext.decodeAudioData(response.data);
let source = audioContext.createBufferSource();
source.buffer = audioBuffer;
source.start();

api.get('/track', (req, res, err) => {
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
  readStream.pipe(res);
});

//register api calls
app.use('/api/v1/', api);

const server = http.createServer(app);
server.listen('3001',  ()  => console.log('Server app listening on port 3001!'));