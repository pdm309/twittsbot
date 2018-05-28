
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

function tweeted(err, data, response){
	if (err){
		console.log("Something went wrong.");
		console.log(err);
		console.log(data);
	}
	else {
		console.log(data);
		console.log("It worked!");
	}
	
}

// Count all of the links from the nodejs build page
var jsdom = require('jsdom/lib/old-api');
var lis;
jsdom.env("https://en.wikipedia.org/wiki/List_of_companies_of_the_United_States",[],
function(errors, window) {
  //console.log("there have been", window.$("a").length, "nodejs releases!");
  lis = window.document.getElementsByTagName("li");
  var begin = false;
  console.log("start");
  for(let i = 1; i < lis.length; i++){
  	setTimeout(function() { 
  		if (lis[i].textContent == "21st Century Fox"){
  			begin = true;
	  	}
	  	if (lis[i].textContent.length >= 2 && begin){
	  		console.log(makeFunny(lis[i].textContent));
	  		t.post('statuses/update', makeFunny(lis[i].textContent), tweeted);
	  		console.log("----------------------------------");
	  		if (lis[i].textContent == "Zynga"){
	  			begin = false;
	  		}
	  	} }, i*2000/*86400000*/);
  	
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

//TODO: find and parse a database for companies, movie titles, basically anything copywritten/trademarked?
//TODO: implement twitter API to publish a tweet of some randomly retrieved makeFunny result
//TODO: host on heroku for free 
//TODO: find more weird edge cases
//TODO: McDonald's monkaS
