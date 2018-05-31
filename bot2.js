var twit = require('twit');

//twitter api setup
var config = require('./config');
var t = new twit(config);


//synchronous file reading
var fs = require('fs');
var array = fs.readFileSync('list.txt').toString().split("\n");
var i = 0;
//recursive function that calls timeout before each iteration Kreygasm
function f(){
    console.log(array[i]);
    t.post('statuses/update', {status: array[i]}, tweeted);
    i++;
    if (i < array.length - 1){
    	setTimeout(f, 28800000)
    }
}
f();

//callback function for error reporting but that will never happen, I'm the greatest programmer to ever greet the world with a "hello"
function tweeted(err, data, response){
	if (err){
		//yeet
		console.log("Something went wrong.");
		console.log(err);
		console.log(data);
	}
	else {
		console.log(data);
		console.log("It worked!");
	}
	
}
