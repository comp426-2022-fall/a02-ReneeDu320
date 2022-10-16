#!/usr/bin/env node

import minimist from "minimist";
import fetch from "node-fetch";
import moment from "moment-timezone";

const args = minimist(process.argv.slice(2));

if(args.h) {
	console.log(
        `
        Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
        -h            Show this help message and exit.
        -n, -s        Latitude: N positive; S negative.
        -e, -w        Longitude: E positive; W negative.
        -z            Time zone: uses tz.guess() from moment-timezone by default.
        -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
        -j            Echo pretty JSON from open-meteo API and exit.
        `
    );
}


const timezone = args.z ? args.z : moment.tz.guess();
const latitude = args.n || args.s * -1;
const longitude = args.e || args.w * -1;
const day = args.d ? args.d : 1;

var url_w = 'https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&day='+day;
console.log(url_w);
const response = await fetch(url_w);
const data = await response.json();
if(args.j) {
	console.log(data);
	process.exit(0);
}

const days = args.d;

if (days == 0) 
{
  console.log("today.")
} else if (days > 1) 
{
  console.log("in " + days + " days.")
} else 
{
  console.log("tomorrow.")
}

console.log(data);