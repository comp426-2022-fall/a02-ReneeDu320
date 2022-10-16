#!/usr/bin/env node
import moment from "moment-timezone";
import fetch from "node-fetch";
import minimist from 'minimist';

//Select args for help
const args = minimist(process.argv.slice(2));
if(args.h){
    console.log('Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] 
LONGITUDE -t TIME_ZONE\n    -h            Show this help message and 
exit.\n    -n, -s        Latitude: N positive; S negative.\n    -e, -w        
Longitude: E positive; W negative.\n    -t            Time zone: uses 
tz.guess() from moment-timezone by default.\n    -d 0-6        Day to 
retrieve weather: 0 is today; defaults to 1.\n    -j            Echo 
pretty JSON from open-meteo API and exit.');
	process.exit(0);

}

//Set timezone
let timezone = "";
if (!args.z) {
	 timezone = moment.tz.guess();
} else {
         timezone = args.z;
}

//Set latitude and longitudes
let lat = 0;
if (args.n) {
	lat = args.n;
} else if (args.s) {
	lat = args.s / -1;
} else {
  console.log("Latitude must be in range");
}

let lon = 0;
if (args.w) {
        lon = args.w;
} else if (args.e) {
        lon = args.e / -1;
} else {
  console.log("Longitude must be in range");
}

//Define fetch Url
const url = "https://api.open-meteo.com/v1/forecast?" + "latitude=" + lat 
+ "&longitude=" + lon + 
"&hourly=temperature_2m&daily=precipitation_hours&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=" 
+timezone;

// Make a request
const response = await fetch(url);

// Get the data from the request
const data = await response.json();

//Output json if arg exists
if (args.j) {
	console.log(data);
	process.exit(0);
} 

//Define days from minimist args
let days = 1;
if (args.d != null){
  if (args.d > 6 || args.d < 0){
    days = 0;
  }
  else{
    days = args.d;
  }
}
if (days == 0) {
	if (data.daily.precipitation_hours[days] == 0) {
		console.log("You will not need your galoshes today.");
	} else {
		console.log("You might need your galoshes today.");
	}
} else if (days > 1) {
	if (data.daily.precipitation_hours[days] == 0) {
		console.log("You will not need your galoshes");
	} else {
		console.log("You might need your galoshes");
	}
	console.log(" in" + days + " days.");
} else {
	if (data.daily.precipitation_hours[days] == 0) {
		console.log("You will not need your galoshes tomorrow.");
	} else {
		console.log("You might need your galoshes tomorrow.");
	}	
}
process.exit(0);

