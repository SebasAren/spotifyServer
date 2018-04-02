#!/usr/bin nodejs
// seperated auth for security reasons
var auth = require('./auth');
var SpotifyWebApi = require('spotify-web-api-node');
var express = require('express');
var url = require('url');
var path = require('path');
var bodyParser = require('body-parser');
var _ = require('lodash');

var app = express();

var currentRequests = [];
var ipList = [];
var authCode;

var jsonParser = bodyParser.json();
app.use(express.static('templates'));
app.use(bodyParser.urlencoded( { extended: true } ));
app.set('trust proxy', true);

app.use('/callback', function(req, res) {
    var q = url.parse(req.url, true);
    authCode = q.query['code'];
    spotifyApi.authorizationCodeGrant(authCode)
        .then(function(data) {
            console.log('The token expires in ' + data.body['expires_in']);
            console.log('The access token is ' + data.body['access_token']);
            console.log('The refresh token is ' + data.body['refresh_token']);

            spotifyApi.setAccessToken(data.body['access_token']);
            spotifyApi.setRefreshToken(data.body['refresh_token']);
        }, function(err) {
            res.write('Something went wrong!', err);
            console.log(err);
        });
    res.write(authCode);
    res.end();
});

app.use('/authorize', function(req, res) {
    var q = url.parse(req.url, true);
    if (q.query['pass'] != auth.password) {
        res.end();
    }
    var scopes = auth.scopes;
    var state = 'spotifyApp';
    var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
    res.write(authorizeURL);
    res.end();
});

app.use('/request', function(req, res) {
    var q = url.parse(req.url, true);
    res.setHeader('Content-Type', 'application/json');
    searchSong(q.query['q'], res);
});

app.use('/overview', function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var result = _.sortBy(currentRequests, 'Votes').reverse();
    res.write(JSON.stringify(result));
    res.end();
});

app.use('/clear', function(req, res) {
    res.setHeader('Content-Type', 'text/plain');
    var q = url.parse(req.url, true);
    if (q.query['pass'] == auth.password) {

        var results = _.sortBy(currentRequests, 'Votes').reverse();
        var tracks = [];
        for (var i = 0; i < 10; i++) {
            try {
                tracks.push(results[i].URI);
            }
            catch(error) {
                break;
            }
        }
        spotifyApi.addTracksToPlaylist(auth.username, auth.playlist, tracks)
            .then(function(data) {
                res.write('Gelukt');
            }, function(err) {
                res.write('Niet gelukt: ' + err);
            })
        clearSession();
        res.end('Thank You!');
    }
    else {
        res.end('Wrong password');
    }
});

app.post('/post', jsonParser, function(req, res) {
    res.setHeader('Content-Type', 'text/plain')
    var ip = req.ip;
    if (ip.substr(0, 7) == '::ffff:') {
        ip = ip.substr(7);
    }
    if (_.includes(ipList, ip)) {
        res.end('false');
        console.log(currentRequests);
    }
    else {
        // uncomment to block ip spamming
        //ipList.push(ip);
        res.end('true');
        var present = _.find(currentRequests, {'Title': req.body['Title']});
        if (typeof present !== 'undefined') {
            present.Votes += 1;
            console.log(currentRequests);
        }
        else {
            var newEntry = req.body;
            newEntry['Votes'] = 1;
            currentRequests.push(newEntry);
            console.log(currentRequests);
        }
    }
});

var server = app.listen(8080);

// setup the spotify api
spotifyApi = new SpotifyWebApi(auth.Authentication);
function setCredentials() {
    spotifyApi.refreshAccessToken()
        .then(function(data) {
            console.log('Expires in ' + data.body['expires_in']);
            console.log('Token = ' + data.body['access_token']);
            spotifyApi.setAccessToken(data.body['access_token']);
        }, function(err) {
            console.log('Token failed', err);
        });
}
  
function searchSong(song, res) {
    spotifyApi.searchTracks(song, {'market': 'NL'})
        .then(function(data) {

            // this gets the relevant info from the api response
            return data.body.tracks.items.map(function(t) {
                var uri = t.uri;
                var title = t.name;
                var duration = t.duration_ms;
                var artists = t.artists.map(function(t) {
                    return t.name;
                });
                return {
                    Artists: String(artists),
                    Title: title,
                    URI: uri,
                    Duration: duration,
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

function clearSession() {
    currentRequests = [];
    ipList = [];
}
