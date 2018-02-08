// seperated auth for security reasons
var auth = require('./auth');
var SpotifyWebApi = require('spotify-web-api-node');
var connect = require('express');
var url = require('url');
var serveStatic = require('serve-static');
var path = require('path');
//var send = require('connect-send-json');
var bodyParser = require('body-parser');

var app = connect();

var jsonParser = bodyParser.json();
app.use(connect.static('templates'));
app.use(bodyParser.urlencoded( { extended: true } ));
app.use('/request', function(req, res) {
    var q = url.parse(req.url, true);
    res.setHeader('Content-Type', 'application/json');
    searchSong(q.query['q'], res);
});

var server = app.listen(8080);

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

function searchSong(song, res) {
    var rv;
    spotifyApi.searchTracks(song)
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
            res.write(JSON.stringify(data));
            res.end();
        })
        .catch(function(error) {
            if (error == 'WebapiError: Unauthorized') {
                setCredentials();
            }
            else {
                console.error(error);
            }
        });
}
