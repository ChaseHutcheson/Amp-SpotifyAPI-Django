const express = require('express');
const request = require('request');
const dotenv = require('dotenv');

const port = 5000;

global.access_token = '';

dotenv.config();

var spotify_client_id = '4cd4e06b75174c259d26fb767aaca67e'
var spotify_client_secret = '43766508ee4848b7a8ad9aa4565e4ae5';
var spotify_redirect_uri = 'http://localhost:3000/auth/callback'


var generateRandomString = function (length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();

app.get('/auth/login', (req, res) => {

  var scope = "ugc-image-upload user-read-playback-state user-modify-playback-state user-read-currently-playing app-remote-control streaming playlist-read-private playlist-read-collaborative playlist-modify-private playlist-modify-public user-follow-modify user-follow-read user-read-playback-position user-top-read user-read-recently-played user-read-email user-read-private "
  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state
  });

  res.redirect('https://accounts.spotify.com/authorize/?' + auth_query_parameters.toString());
});


app.get('/auth/callback', (req, res) => {

  var code = req.query.code;

  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: spotify_redirect_uri,
      grant_type: 'authorization_code'
    },
    headers: {
      'Authorization': 'Basic ' + (Buffer.from(spotify_client_id + ':' + spotify_client_secret).toString('base64')),
      'Content-Type' : 'application/x-www-form-urlencoded'
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.redirect('/');
    }
  });
});


app.get('/auth/token', (req, res) => {
  res.json({
    access_token: access_token
  });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Spotify Auth App!');
});
  

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
