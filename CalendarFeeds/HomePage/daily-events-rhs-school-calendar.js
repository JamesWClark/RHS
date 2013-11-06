/*
 * Daily Events by J.W. Clark
 * Published for Rockhurst High School
 * July 17, 2013
 * Updated November 6, 2013
 *
 * 1. get a series of feeds from a list of google calendars
 * 2. if today has less than 4 events, continue searching forward until at least 4 events are found.
 * 3. the search will end at the end of the feed
 *
 * https://github.com/JamesWClark/RHS/blob/master/CalendarFeeds/HomePage/daily-events-rhs-school-calendar.js
 *
 * Version 2
 */

//VARIABLES
var processBegin = new Date().getMilliseconds();

var MINIMUM_EVENTS = 4;
var DAYS_TO_SEARCH_FORWARD = 30;

var CALENDARS = [ //these are the IDs of each calendar, found under calendar settings in a Google account's Calendar system
     'calendar%40rockhursths.edu',                                                //School Calendar
     'rockhursths.edu_vm6bt9h5uust4qkr1tqnkmtnac%40group.calendar.google.com',    //Academics
     'rockhursths.edu_i0q5jb98knpj5otsfunnug130s%40group.calendar.google.com',    //Admissions
     'rockhursths.edu_ofu8dje33m4sqnk8vndgpucj18%40group.calendar.google.com',    //College Placement
     'rockhursths.edu_1g6c8cidfi6n2egc7pot13bqs4%40group.calendar.google.com',    //Ignatian Service
     'rockhursths.edu_mpoj50ourh6q5qct7rt4541ce0%40group.calendar.google.com',    //Parents
     'rockhursths.edu_mg0qisv0bjebtb6g03mukq6100%40group.calendar.google.com',    //Pastoral Life
     'rockhursths.edu_ehaulvhli4eceq1r6i85m4ur8g%40group.calendar.google.com',    //Performing Arts
     'rockhursths.edu_emstvmu50a5eulokqg749n1jrg%40group.calendar.google.com',    //Student Life
     'rockhursths.edu_0rtqoob8p01fg51m36hfn6mf08%40group.calendar.google.com',    //Alumni
     'rockhursths.edu_q5acu8rlb090te1ftbb0cv1fs4%40group.calendar.google.com',    //Faculty & Staff
     'rockhursths.edu_s4dmspq8g7oh5beh4mho272mog%40group.calendar.google.com',    //Summer Camps & School
     'rockhursths.edu_89fbs6i2rm7qncgk5ttjd95uao%40group.calendar.google.com',    //Basketball - Varsity
     'rockhursths.edu_t8eq93kjsq5tklpnd1kke45pus%40group.calendar.google.com',    //Cross Country - Varsity
     'rockhursths.edu_b2sg20067asnpm5bunlbk07hes%40group.calendar.google.com',    //Football - Varsity
     'rockhursths.edu_017ca5s1pkqlo26p86sq0dqta0%40group.calendar.google.com',    //Soccer - Varsity
     'rockhursths.edu_6r3vm39418qahh989qrhqn3hd4%40group.calendar.google.com',    //Swim & Dive - Varsity
     'rockhursths.edu_fpdevts40susg3j1ueoubsrrt8%40group.calendar.google.com'     //Wrestling - Varsity
];

var feedsProcessedCount = 0;
var dailyEventsCount = 0;

var validEntries = new Array();
var extraEntries = new Array();

//putting today in the moment(today) constructor isn't necessary, but it allows for convenient testing such as
//var today = moment('2013-11-24').format();
//then the entire application shifts and operates around today as november 24th as in the example.
var today = moment().format();
var startMin = moment(today).format('YYYY-MM-DD');
var startMax = moment(today).add('days', 30).format('YYYY-MM-DD');

$(document).ready(init());

function init() {
    getCalendarFeeds();
}
function getCalendarFeeds() {
    for (var i = 0; i < CALENDARS.length; i++) {
        var https = 'https://www.google.com/calendar/feeds/' + CALENDARS[i] + '/public/full?alt=json&orderby=starttime&sortorder=ascending&singleevents=true&start-min=' + startMin + '&start-max=' + startMax;
        $.ajax({
            url: https,
            dataType: 'jsonp',
            type: "GET",
            success: function (response) {
                processFeed(response.feed);
            }
        });
    }
}

function processFeed(feed) {
    feedsProcessedCount++;

	//why? google automatically injects the max-results=25 parameter into the calendar query
    var numResults = feed.openSearch$totalResults.$t; 
    if (numResults > 25)
        numResults = 25;
    
    for (var i = 0; i < numResults; i++) { //process every entry in the feed
        processEntry(feed.entry[i]);
    }
    if (feedsProcessedCount === CALENDARS.length) { //the ajax requests are complete, sort and print
        $('#rhs-home-daily-events').html('');
        printEntries();
    }
}
function processEntry(entry) {
    var e = getEntryBase(entry);
    e.startTime = entry.gd$when[0].startTime;
    e.endTime = entry.gd$when[0].endTime;
    validateEntry(e);
}
function getEntryBase(entry) {
    var e = new Object();
    e.id = entry.id.$t;
    e.title = entry.title.$t;
    e.location = entry.gd$where[0].valueString;
    e.description = entry.content.$t;
    e.link = entry.link[0].href;
    return e;
}
function validateEntry(entry) { //returns boolean
    //compare on day, month, year only
    var start = moment(entry.startTime).startOf('day').format();
    var end = moment(entry.endTime).endOf('day').format();

    if (start <= today && today <= end) {
        validEntries.push(entry);
        dailyEventsCount++;
        return true;
    } else {
        extraEntries.push(entry);
        return false;
    }
}
function updateEntry(entries, entry) {
    for (var i = 0; i < entries.length; i++) {
        if (entries[i].startTime === entry.update.startTime && entries[i].id.toString().split("/full/")[1] === entry.update.id) {
            entries[i] = entry;
            entries.pop(); //why pop? the last action on the array was a push before this inspection, so pop simply removes the item ... otherwise it will appear twice in the list
        }
    }
}
function printEntries() {
    sortEntries(validEntries);
    for (var i = 0; i < validEntries.length; i++) {
        writeHtml(validEntries[i]);
    }
    if (dailyEventsCount < MINIMUM_EVENTS) { //minimum count not satisifed, pull from the extra entries
        sortEntries(extraEntries);
        var deficit = MINIMUM_EVENTS - dailyEventsCount;
        var length = extraEntries.length;
        var i = 0;
        while (deficit-- > 0 && length-- !== 0) {
            writeHtml(extraEntries[i++]);
        }
    }
	log('daily events count = ' + dailyEventsCount);
    var processEnd = new Date().getMilliseconds();
}
function sortEntries(entries) {
    entries.sort(function (a, b) {
        var x = a["startTime"];
        var y = b["startTime"];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
function writeHtml(entry) {
    //this function writes HTML to the DOM on a per calendar entry basis
    //modify the object in the processEntry() method before pulling its properties here
    var html = '<tr><td><a href="' + entry.link + '" target="_blank">' + entry.title + '</a>'
        + '<br /><span style="color: #666">' + getTimeHtml(entry.startTime, entry.endTime) + '</span>';
    if (entry.description.length > 0)
        html += '<br />' + entry.description;
    if (entry.location.length > 0)
        html += '<br /><a href="https://maps.google.com/maps?q=' + entry.location + '&hl=en" target="_blank">' + entry.location + '</a>';
    html += '</td></tr><tr><td>&nbsp;</td></tr>';

    $('#rhs-home-daily-events-feed-results > tbody:last').append(html);
}
function getTimeHtml(start, finish) {
    var sIndexT = start.indexOf('T');
    var fIndexT = finish.indexOf('T');
    var sTimeString;
    var fTimeString;
    var sDateString = moment(start).format('dddd, MMMM D');
    var fDateString = moment(finish).format('dddd, MMMM D');

    //process the start time
    if (sIndexT !== -1) { //process as ISO Format
        sTimeString = moment(start).format('h:mm a');
    }
    //process the finish time
    if (fIndexT !== -1) { //process as ISO Format
        fTimeString = moment(finish).format('h:mm a');
    }
	
    //start and finish can be of two formats: 1) 2013-07-07, or 2) 2013-07-07T00:00:00.000Z (ISO Format)
    //new Date('2013-07-07') equals July 6, and new Date('2013-07-01') equals June 30
    //this is a big difference in how to process ISO Format versus YYYY-MM-DD format
    if (new Date(finish) - new Date(start) === 86400000 && sIndexT === -1) { //single all day event, no times
        return sDateString;
    } else if (sDateString === fDateString && sIndexT !== -1) { //single day, span of time
        if (sTimeString === fTimeString) //start and finish time are the same, no need to show twice (reader will treat this as event with start time only)
            return sDateString + ', ' + sTimeString;
        else
            return sDateString + ', ' + sTimeString + ' to ' + fTimeString;
    } else if (sDateString !== fDateString && sIndexT !== -1) { //span across dates + start and finish time
        return sDateString + ', ' + sTimeString + ' to ' + fDateString + ', ' + fTimeString;
    } else //a span of 24-hour events, midnight to midnight (like School & Offices closed over a three day period)
        return sDateString + ' to ' + fDateString;
}
function log(msg) {
    if (window.console && console.log) {
        console.log(msg);
    }
}

/* NOTES

It's probably necessary to process recurring events differently, in order to show a series like daily football camps as Monday - Friday, 10:00 am - 2:00 pm
The current implementation shows every single day as separate line items

There's really gotta be a better way to ID a recurring event that has been edited for a single item after all recurrence entries have been entered on the calendar

found this important solution piece - recurring event replacement has attribute: gd$originalEvent with the ID that points to the original...


wow! - adding to query string really solves a lot of problems.... 
&singleevents=true
per documentation of https://developers.google.com/google-apps/calendar/v1/reference#Parameters
what's up with that?
    i found an incident where a recurring event had no gd$when in the entry. my code is built on the assumption that value exists. 

*/