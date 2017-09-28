
//Create package.json
//Steps to do this:
//cd into correct directory
//npm init
//give it a name and whatever
//is this ok? say y
//ls and see that package.json has been created
//npm install --save inquirer //this will appends stuff to package.json
//ls and node_modules inidicates 3rd party stuff is attached
//cat package.json to see what is in there
//run userprompt.js
//cat user prompt.js - to see what is in there already

//npm install twitter
//npm install request
//npm install --save node-spotify-api


//spotify
// https://api.spotify.com/v1/users/liribotic/tracks
//https://api.spotify.com/v1/tracks/
//https://api.spotify.com/v1/users/myspotifyusername/playlists/37i9dQZEVXbJiZcmkrIHGU?fields=tracks%2Cnext:

//curl -X GET "https://api.spotify.com/v1/tracks/3n3Ppam7vgaVa1iaRUc9Lp" -H "Authorization: Bearer {your access token}"
// Client ID
// 1c5d269876424a96a36d7e41b2e853b0
// Client Secret
// 789a7afa7e034578995909522c72028d

//omdb API
//var queryURL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=40e9cece";

//======================================================
// require the keys.js file that holds the twitter keys
var twitterKeysObject = require('./keys.js'); //****check that the module export matches to variable name depending on use of Line 47 or not****


// Install npm libraries before running this app with following:
// npm install twitter, npm install --save node-spotify-api, npm install request
var Twitter = require('twitter');
var Spotify = require('spotify');
var Request = require('request');


//require node fs (file system) library package, for file system access
var fs = require('fs');//download inquirer?

//*****I have no idea******
//Data is received as an object. but the original data was an object too
//Peel a layer back to get to the actual keys object
var twitterKeys = twitterKeyssObject.twitterKeys;


//make it so liri.js can take in one of the following commands:
//my-tweets
//spotify-this-song
//movie-this
//do-what-it-says

//save command to variable; used to switch /case and it can be used to to grab and append to log.txt 
var command = process.argv[2];

///save command argument to variable; it will be used for spotify-this-song and movie-this and it can be used to to grab and append to log.txt 
var commandArg = process.argv[3];

//swich based on command received
switch (command) {

	//handle my-tweets command
	case 'my-tweets':
	myTweets();
	break; //keeps on going down the list if there is no break

	case 'spotify-this-song':
	mySpotify(commandArg);
	break; 

	case 'movie-this':
	movieThis(commandArg);
	break; 

	case 'do-what-it-says':
	myTweets();
	break; 

	default:
	console.log("[Enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says]");
	break; //prob don't need a break for the last item
	
} //end of switch

//run node liri.js my-tweets, to show last 20 tweets and when they were created.
function myTweets() {
	var twitterKeys = new Twitter({
  consumer_key: twitterKeys.consumer_key
  consumer_secret: twitterKeys.consumer_secret
  access_token_key: twitterKeys.access_token_key
  access_token_secret: twitterKeys.access_token_secret
});//closes twitterKeys

//get the last 20 tweets
client.get('statuses/user_timeline', {count: 20}, function(error,tweets,response) {
	console.log(tweets);

if(error) return console.log("Twitter error: " + error);

//log Command to log.txt file
logCommand();//function 

	//loop for 20 retweets and return the time and content
	for (var i = 0; i < tweets.length; i++) {

	console.log("====MY-TWEETS=======")
	console.log(tweets[i].created_at);
	console.log(tweets[i].text);
	console.log("====================")

	//adds text to log.txt
	logThis("====MY-TWEETS=======")
	logThis(tweets[i].created_at);
	logThis(tweets[i].text);
	logThis("====================")

	//fs.appendFile('log.txt', "=======TWEETS=======")
	//fs.appendFile('log.txt', "@liribot2017: " + tweets[i].text + "Created when: " + tweets[i].created_at.substrig(0,19));
	//fs.appendFile('log.txt', "====================");


		}//closes loop function

	});//closes client.get function

}//closes myTweets function




//run node liri.js spotify-this-song, to show match result
function mySpotify(songInput){

//store name of song from command line in var Song
//if no song is inputted, default to the Sign Ace of Base

var Song = songInput ? songInput : 'the Sign Ace of Base'

//run Spotify API search by track name stored in var Song
Spotify.search({type: 'track', query: Song}, function(err, data) {


	//if error is in callback, show error and exit function
	if (err) return console.log("Spotify Song error: " + err);

	//if song not found in Spotify, log and exit mySpotify function
	if (data.[tbd, idk the Spotify API].length === 0) return (console.log("No song found by that name")); 	

	//log issue to log.txt
    logCommand();

    // print result to console, set up to 1st match (0th item) since API search can return w/ mutliple results
	console.log("================SPOTIFY-ME========================");
	console.log("Artist(s): " + data.track.items[0].artists[0].name);
    console.log("Song's name: " + data.track.items[0].name);
    console.log("Preview Link: " + data.track.items[0].preview_url);
    console.log("Album: " + data.track.items[0].album.name);
    console.log("==================================================");

    //log the song details, set up to 1st match (0th item) since API search can return w/ mutliple results
    logResults("====================SPOTIFY-ME=======================");
    logResults("Artist(s): " + data.track.items[0].artists[0].name);
    logResults("Song's name: " + data.track.items[0].name);
    logResults("Preview Link: " + data.track.items[0].preview_url);
    logResults("Album: " + data.track.items[0].album.name);
    logResults("======================================================");

	//fs.appendFile('log.txt', "=======SPOTIFY SONG=======");
	//fs.appendFile('log.txt', "Artist(s): " + data.track.items[0].artists[0].name);
	//fs.appendFile('log.txt', "Song's name: " + data.track.items[0].name);
	//fs.appendFile('log.txt', "Preview Link: " + data.track.items[0].preview_url);
	//fs.appendFile('log.txt', "Album: " + data.track.items[0].album.name);
	//fs.appendFile('log.txt', "==========================");

	});//close search function

}// close mySpotify function



//run node liri.js movie-this, to show match result
function movieThis(movieInput) {

//store name of song from command line in var Movie
//if no song is inputted, default to Mr. Nobody
var Movie = movieInput ? movieInput : 'Mr.Nobody'

Request("http://www.omdbapi.com/?t=" + Movie + "&y=&plot=short&apikey=40e9cece", function (error,response, body) {
	console.log(body);

//Reponse code is 200 if request goes through
if(!error && response.statusCode === 200) {

	console.log("=======================MOVIE-THIS==========================");
	console.log('Title of the Movie: ' + JSON.parse(body).Title);
    console.log('Release Year: ' + JSON.parse(body).Year);
    console.log('IMDB Rating: ' + JSON.parse(body).imdbRating);
    console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings.Value);
    console.log('Country: ' + JSON.parse(body).Country);
    console.log('Language: ' + JSON.parse(body).Language);
    console.log('Plot: ' + JSON.parse(body).Plot);
    console.log('Actors: ' + JSON.parse(body).Actors);   	
   	console.log("==========================================================");
	
	//log command in log.txt file
	logCommand();

	// log the movie details in log.txt file. Thr format can return raw, so parse the returned data (body)
	logResults("=======================MOVIE-THIS=============================");
	logResults('Title of the Movie: ' + JSON.parse(body).Title);
    logResults('Release Year: ' + JSON.parse(body).Year);
    logResults('IMDB Rating: ' + JSON.parse(body).imdbRating);
    logResults('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings.Value);
    logResults('Country: ' + JSON.parse(body).Country);
    logResults('Language: ' + JSON.parse(body).Language);
    logResults('Plot: ' + JSON.parse(body).Plot);
    logResults('Actors: ' + JSON.parse(body).Actors);   
   	logResults("==============================================================");

	}//close response

if (Movie === "Mr. Nobody") {
	console.log("=================MR.NOBODY (DEFAULT)===================");
	console.log("If you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/");
	console.log("It's on Netflix!")
	console.log("=======================================================");

	// log the movie details in log.txt file. 
	logResults("====================MR.NOBODY (DEFAULT)=====================");
	logResults("If you haven't watched 'Mr. Nobody', then you should: http://www.imdb.com/title/tt0485947/");
	logResults("It's on Netflix!")
	logResults("============================================================");


		}//closes Mr.Nobody

	});//closes omdb request function


}//close movieThis function


function doWhatItSays() {

	fs.readFile('random.txt', 'utf8', function(error, data) {

	//if error caught during read file, log and exit function
	if (error) return console.log("File system error, cannot read file: " + error);

	// split data array: an array of function(command) name and argument (query)
	var dataArray = data.split(",");

	var commandData = dataArray[0];
	var argData = dataArray[1];

// modify the commandData received/used in this app
//my-tweets
//spotify-this-song
//movie-this
//do-what-it-says

	switch (commandData) {
		case 'my-tweets':
			commandData = 'myTweets';
			break;
		case 'spotify-this-song':
			commandData = 'mySpotify';
			break;
		case 'movie-this':
			commandData = 'movieThis';
			break;
		default:
			console.log('Error in do-what-it-says function');
	}//close switch commandData
	eval(commandData)(argData);


	}); //close fs readfile function
} //close doWhatItSays function


//function to log API search results into log.txt file 
function logResults(dataResults)) {

	// log the data to console
	console.log(dataResults);

	// also append it to log.txt followed by new line escape
	fs.appendFile('log.txt', dataResults + '\n', function(error) {
		
	// if there is an error log that then end function
	if (error) return console.log('Error logging data to file: ' + error);
	
	
	}); // close the fs appendFile function


} // close the logResults function


//function to log command inputted to log.txt file 
function logCommand() {

	// structure the string that equates to the command that was issued
	if (commandArg) {
		var formatString = "COMMAND, node liri.js: " + command + " '" + commandArg + "'";
	} else {
		var formatString = "COMMAND, node liri.js: " + command;
	}

		// append the command to log.txt followed by new line escape
		fs.appendFile('log.txt', formatString + '\n', function(error) {
		
		// if there is an error log that then end function
		if (error) return console.log('Error logging command to file: ' + error);
	
	
	}); // close the fs appendFile function


}// close the logCommand function



	//Should have been an easier way to write do-what-it-says, Global function for the first switch, refer to example, app[process.argv[2]](process.argv[3]);
