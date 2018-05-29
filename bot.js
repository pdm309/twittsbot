var twit = require('twit');
var syl = require('syllable');
var nlp = require('nlp_compromise');
var nlpSyl = require('nlp-syllables');
nlp.plugin(nlpSyl);

//twitter api setup
var config = require('config');
var t = new twit(config);

//test tweet
var tweet = {status: 'Test\'s Tweet'};
t.post('statuses/update', tweet, tweeted);

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

var jsdom = require('jsdom/lib/old-api');
var lis;
//convert URL to DOM
jsdom.env("https://en.wikipedia.org/wiki/List_of_companies_of_the_United_States",[],
function(errors, window) {
  //form NodeList of all list elements in the DOM	
  lis = window.document.getElementsByTagName("li");
  //bool for determining the first li
  var begin = false;
  //start the iterations!
  console.log("start");
  for(let i = 1; i < lis.length; i++){
  	setTimeout(function() { 
  		//yeah this is the first result that's actually a company/phrase
  		if (lis[i].textContent == "21st Century Fox"){
  			begin = true;
	  	}
	  	//now we've gotten to the real stuff
	  	if (lis[i].textContent.length >= 2 && begin){
	  		//the textContent of the list element has the string we want to manipulate and tweet
	  		console.log(makeFunny(lis[i].textContent));
	  		t.post('statuses/update', makeFunny(lis[i].textContent), tweeted);
	  		console.log("----------------------------------");
	  		if (lis[i].textContent == "Zynga"){
	  			//4 years and 8 months later
	  			begin = false;
	  		}
	  	} }, i*86400000); //once a day
  	
  };
});

function makeFunny(s){

	console.log(s);
	var res = "";
	var sArr = s.split(" ");

	if (sArr.length < 2){
		// one word? no problem
		var isCapital = false;
		if (s.charAt(0) == s.charAt(0).toUpperCase()){
			isCapital = true;
		}
		var term = nlp.term(s);
		var termSyl = term.syllables(); // separate the word into syllables
		
		var firstSylGroup = "";
		var secondSylGroup = "";

		// use the length of the syllable array to group the syllables into 2 groups and pluralize the first
		for (var i = 0; i < Math.ceil(termSyl.length/2); i++){
			firstSylGroup += termSyl[i];
		}
		// make that first syllable group posessive, whatever it is
		if (firstSylGroup.endsWith("s")){
			firstSylGroup += "'";
		}
		else {
			firstSylGroup += "'s";
		}
		// form a word of the rest of the syllables
		for (var j = Math.ceil(termSyl.length/2); j < termSyl.length; j++){
			secondSylGroup += termSyl[j];
		}
		if (isCapital){
			firstSylGroup = firstSylGroup.charAt(0).toUpperCase() + firstSylGroup.slice(1);
			secondSylGroup = secondSylGroup.charAt(0).toUpperCase() + secondSylGroup.slice(1);
		}
		//combine the two "words"
		res = firstSylGroup + " " + secondSylGroup;

	}
	else {
		while (sArr.length >= 2){ 
			// while there exists more than one word left, pluralize and add the first one
			var p = sArr.shift();
			if (p.endsWith("s")){
				res += p + "' ";
			}
			else {
				res += p + "'s ";
			}
		}
		// only one word left
		res += sArr.shift();
	}
	return res;
}

//TODO: find and parse a database for companies, movie titles, basically anything copywritten/trademarked? CHECK
//TODO: implement twitter API to publish a tweet of some randomly retrieved makeFunny result CHECK
//TODO: host on heroku for free CHECK
//TODO: find more weird edge cases ... heh about that
//TODO: McDonald's monkaS ... monkaSHAKE
