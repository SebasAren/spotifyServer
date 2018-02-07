var SpotifyWebApi = require('spotify-web-api-node');
var http = require('http');

var spotifyApi = new SpotifyWebApi({
    clientId: '6c8fb8714d5c433b915ccda4a9bcb35b',
    clientSecret: '2e40b3d52b1b4c8e93c07a9848ff5907',
    redirectUri: 'http://localhost:8080/callback',
});
spotifyApi.clientCredentialsGrant()
    .then(function(data) {
        console.log('Expires in' + data.body['expires_in']);
        console.log('Token = ' + data.body['access_token']);

        spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
        console.log('Token failed', err);
    });
