// will be needed to save requests and serve html page
var fs = require('fs');
// seperated auth for security reasons
var auth = require('./auth');
var http = require('http');
var url = require('url');
var SpotifyWebApi = require('spotify-web-api-node');

// setup the spotify api
spotifyApi = new SpotifyWebApi(auth.Authentication);
function setCredentials() {
    spotifyApi.clientCredentialsGrant()
        .then(function(data) {
            console.log('Expires in ' + data.body['expires_in']);
            console.log('Token = ' + data.body['access_token']);
            spotifyApi.setAccessToken(data.body['access_token']);
        }, function(err) {
            console.log('Token failed', err);
        });
}

// start server
http.createServer(function(req, res) {
    var q = url.parse(req.url, true).query;
    spotifyApi.searchTracks(q.track)
        .then(function(data) {

            // this gets the relevant info from the api response
            return data.body.tracks.items.map(function(t) {
                var uri = t.uri;
                var title = t.name;
                var artists = t.artists.map(function(t) {
                    return t.name;
                });
                return {
                    Artists: String(artists),
                    Title: title,
                    URI: uri,
                };
            });
        })
        .then(function(data) {

            // this data is the relevant information
            console.log(data);
        })
        .catch(function(error) {
            if (error == 'WebapiError: Unauthorized') {
                setCredentials();
            }
            else {
                console.error(error);
            }
        });
}).listen(8080);
