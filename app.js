require('dotenv').config();

const express = require('express');
const hbs = require('hbs');



// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
hbs.registerPartials(__dirname + "/views/partials");


// setting the spotify-api goes here
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data =>{
    spotifyApi.setAccessToken(data.body['access_token']);
    console.log('authentification réussie')
  })
  .catch(error => console.log('Something went wrong when retrieving an access token', error));

let artist;
// Our routes go here:
app.get('/', (req, res, next) => {
  res.render('home', { title: 'home' })
})
app.get('/artist-search', (req, res, next)=>{//
  // demander les groupes qui s'appelent "Mozart"
  spotifyApi
  .searchArtists(req.query.artist)
  .then(data => { 
    res.render('artist-search-results',  {myArtists : data.body.artists.items, title : 'artists'});
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
  
})

//route get artist album
app.get('/albums/:artistId',(req, res, next)=>{
  spotifyApi
  .getArtistAlbums(req.params.artistId)
  .then(data =>{
    res.render('albums', {albums: data.body.items, title : 'albums'})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})

//route get track album
app.get('/tracks/:albumId',(req, res, next)=>{
  spotifyApi
  .getAlbumTracks(req.params.albumId)
  .then(data =>{
    res.render('tracks', {tracks: data.body.items, title : 'tracks'})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})



app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
