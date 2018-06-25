require("dotenv").config();

// import keys from keys.js file 
var keys = require("./keys.js");

var twitterCredentials = keys.twitter;

// create variables for user interaction: [ command ] [ query ]
var command = process.argv[2];
var query = process.argv[3];

// create function to display my last 20 tweets

var myTweets = function () {
	// import Twitter npm package
	var Twitter = require('twitter');
	var client = new Twitter(keys.twitter);

	// create a variable for my Twitter API parameters
	var params = {
		screen_name: 'AbyAngelina',
		count: 20
	};

	// GET request for my last 20 tweets 
	client.get('statuses/user_timeline', params, function (error, tweets, response) {
		if (error) { // print error if there is an error
			console.log('Error occurred: ' + error);
		} else { // otherwise, print my most recent 20 tweets, and the counter (#) 
			console.log('---------------------------------------');
			console.log("The Most Recent 20 Tweets @AbyAngelina:");
			console.log("");
			for (var i = 0; i < tweets.length; i++) {
				console.log("( #" + (i + 1) + " )  " + tweets[i].text);
				console.log("Created:  " + tweets[i].created_at);
				console.log("");
			}
		}
	});
}

var spotifyThisSong = function (trackQuery) {
	//import Spotify npm package
	var Spotify = require('node-spotify-api');
	var spotify = new Spotify(keys.spotify);
	//if no trackQuery is requested, then default to "The Sign" by Ace of Base
	if (trackQuery === undefined) {
		trackQuery = "The Sign by Ace of Base";
	}

	// Spotify API request to display artist(s), song name, preview link, and album)
	spotify.search({ type: 'track', query: trackQuery }, function (error, data) {
		if (error) { // print error if there is an error
			console.log('Error occurred: ' + error);
		} else { // otherwise, display the track and the artist(s)
			for (var i = 0; i < data.tracks.items[0].artists.length; i++) {
				if (i === 0) {
					console.log("Artist(s):    " + data.tracks.items[0].artists[i].name);
				} else {
					console.log("              " + data.tracks.items[0].artists[i].name);
				}
			}
			console.log("Song:         " + data.tracks.items[0].name);
			console.log("Preview Link: " + data.tracks.items[0].preview_url);
			console.log("Album:        " + data.tracks.items[0].album.name);
		}
	});
}

var movieThis = function (movieQuery) {
	// import request npm module
	var request = require("request");
	// if no query is requested, then default to 'Mr. Nobody'
	if (movieQuery === undefined) {
		movieQuery = "mr nobody";
		console.log("-----------------------");
      	console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
      	console.log("It's on Netflix!");
	}

	// perform the OMDb API HTTP GET request 
	request("http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&r=json&apikey=trilogy", function (error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log("* Title of the movie:         " + JSON.parse(body).Title);
			console.log("* Year the movie came out:    " + JSON.parse(body).Year);
			console.log("* IMDB Rating of the movie:   " + JSON.parse(body).imdbRating);
			console.log("* Country produced:           " + JSON.parse(body).Country);
			console.log("* Language of the movie:      " + JSON.parse(body).Language);
			console.log("* Plot of the movie:          " + JSON.parse(body).Plot);
			console.log("* Actors in the movie:        " + JSON.parse(body).Actors);

			// parse through to display the Rotten Tomatoes rating
			for (var i = 0; i < JSON.parse(body).Ratings.length; i++) {
				if (JSON.parse(body).Ratings[i].Source === "Rotten Tomatoes") {
					console.log("* Rotten Tomatoes Rating:     " + JSON.parse(body).Ratings[i].Value);
					if (JSON.parse(body).Ratings[i].Website !== undefined) {
						console.log("* Rotten Tomatoes URL:        " + JSON.parse(body).Ratings[i].Website);
					}
				}
			}
		}
	});
}

// interact with the user's input
if (command === "my-tweets") {
	myTweets();
} else if (command === "spotify-this-song") {
	spotifyThisSong(query);
} else if (command === "movie-this") {
	movieThis(query);
} else if (command === "do-what-it-says") {
	// file read / loads fs npm package
	var fs = require("fs");
	fs.readFile("random.txt", "utf-8", function (error, data) {
		var command;
		var query;

		if (data.indexOf(",") !== -1) {
			var dataArr = data.split(",");
			command = dataArr[0];
			query = dataArr[1];
		} else {
			command = data;
		}

		if (command === "my-tweets") {
			myTweets();
		} else if (command === "spotify-this-song") {
			spotifyThisSong(query);
		} else if (command === "movie-this") {
			movieThis(query);
		} else { 
			console.log("Your command is not recognized! Please try again.")
		}
	});
} else if (command === undefined) { 
	console.log('------------------------------------');
	console.log('Hello! Welcome to ... A by Angelina');
	console.log('This is my first Liri App! Enjoy it!');
	console.log('Please enter a command to run LIRI.');
	console.log('-------------------------------------');
} 
else { 
	console.log('----------------------------------------------------');
	console.log('Hello! Welcome to ... A by Angelina');
	console.log('This is my first Liri App! Enjoy it!');
	console.log('Your command is not recognized! You have 4 choices:');
	console.log('Choice #1: my-tweets');
	console.log('Choice #2: spotify-this-song');
	console.log('Choice #3: movie-this');
	console.log('Choioce #4: do-what-it-says');
	console.log('Please try again. Have fun!');
	console.log('----------------------------------------------------')
}