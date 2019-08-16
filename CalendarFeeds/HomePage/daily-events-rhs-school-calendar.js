/*
 * Daily Events by J.W. Clark
 * Published for Rockhurst High School
 * July 17, 2013
 * Updated August 16, 2019
 *
 * 1. get a series of feeds from a list of google calendars
 * 2. if today has less than 4 events, continue searching forward until at least 4 events are found.
 * 3. the search will end at the end of the feed
 *
 * https://github.com/JamesWClark/RHS/blob/master/CalendarFeeds/HomePage/daily-events-rhs-school-calendar.js
 * example json data: http://www.jsonmate.com/permalink/546a52ce8622dbdf0c422f93
 * another example:   http://www.jsonmate.com/permalink/546a796e8622dbdf0c422f95
 * Version 0.4
 * - added new Athletics feed
 */

//VARIABLES
var KEY = 'AIzaSyDU1yMxRcZrs8M_dT9SeLxs6hT7Nzmqjyk'; //get from calendar@rockhursths.edu account, google developer api console
var MINIMUM_EVENTS = 4;
var DAYS_TO_SEARCH_FORWARD = 7;

var CALENDARS = [ //these are the IDs of each calendar, found under calendar settings in a Google account's Calendar system
     'calendar%40rockhursths.edu',                                                              //School Calendar
     'rockhursths.edu_2vs1fiofi6ho9intt8a6cdpulc@group.calendar.google.com',                    //Daily Schedule
     'c4pcv378aei4lite7fuvh2fg5jqnm73h%40import.calendar.google.com'                            //Athletics
];

var feedsProcessedCount = 0;
var dailyEventsCount = 0;
var entries = [];

//putting today in the moment(today) constructor isn't necessary, but it allows for convenient testing such as
//var today = moment('2013-11-24').format();
//then the entire application shifts and operates around today as november 24th as in the example.
var today = moment();
var startMin = today.format('YYYY-MM-DD');
var startMax = moment(today).add('days', DAYS_TO_SEARCH_FORWARD).format('YYYY-MM-DD');

$(document).ready(init());

function init() {
    getCalendarFeeds();
}

function getCalendarFeeds() {
    for (var i = 0; i < CALENDARS.length; i++) {
        var https = 'https://www.googleapis.com/calendar/v3/calendars/' + CALENDARS[i] + '/events?singleEvents=true&orderBy=startTime&sortOrder=ascending&timeMin=' + moment(startMin).format() + '&timeMax=' + moment(startMax).format() + '&key=' + KEY;
        $.ajax({
            url: https,
            dataType: 'jsonp',
            type: "GET",
            success: function (response) {
                processFeed(response);
            }
        });
    }
}

function processFeed(feed) {
    feedsProcessedCount++;

    //why? google automatically injects the max-results=25 parameter into the calendar query
    //so, if results = 46, you still only get 25 entries and the for loop hits null results
    //alternate: ?alt=json&max-results=100&orderby=starttime&sortorder=ascending&singleevents=true
    var numResults = feed['items'].length;
    if (numResults > 25)
        numResults = 25;

    for (var i = 0; i < numResults; i++) { //process every entry in the feed
        processEntry(feed['items'][i]);
    }
    if (feedsProcessedCount === CALENDARS.length) { //the ajax requests are complete, sort and print
        printEntries();
    }
}

function processEntry(entry) {
    var e = getEntryBase(entry);
    entries.push(e);
}

//i had to change the right side of these equations for v3
function getEntryBase(entry) {
    var e = {};
    e.id = entry.id;
    e.title = entry.summary;
    e.location = entry.location;
    e.description = entry.description;
    e.link = entry.htmlLink;
    var start = entry.start;
    var end = entry.end;
    if (start.hasOwnProperty('date')) {
        e.startTime = entry.start.date;
    } else {
        e.startTime = entry.start.dateTime; //assumption: has dateTime
    }
    if (end.hasOwnProperty('date')) {
        e.endTime = entry.end.date;
    } else {
        e.endTime = entry.end.dateTime; //assumption: has dateTime
    }
    return e;
}

function printEntries() {
    sortEntries(entries);
    var count = 0;
    //now is between the entry's start of day and end of day
    while (moment(today.endOf('day')).diff(moment(entries[count].startTime)) > 0) {
        writeHtml(entries[count++]);
    }
    if (count < MINIMUM_EVENTS) { //minimum count not satisifed, pull from the extra entries
        var deficit = MINIMUM_EVENTS - count;
        var length = entries.length - count;
        while (deficit-- > 0 && length-- !== 0) {
            writeHtml(entries[count++]);
        }
    }
}

function sortEntries(entries) {
    entries.sort(function (a, b) {
        var x = a.startTime;
        var y = b.startTime;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function writeHtml(entry) {
    //this function writes HTML to the DOM on a per calendar entry basis
    //modify the object in the processEntry() method before pulling its properties here
    var html = '<tr><td><strong><a href="' + entry.link + '" target="_blank">' + entry.title + '</a></strong>'
        + '<br /><span style="color: #666">' + getTimeHtml(entry.startTime, entry.endTime) + '</span>';
    if (entry.description && entry.description.length > 0) { //has description and description length
        html += '<br />' + entry.description;
    }
    if (entry.location && entry.location.length > 0)
        html += '<br /><span style="font-color:black;">Location: </span><a href="https://maps.google.com/maps?q=' + entry.location + '&hl=en" target="_blank">' + entry.location + '</a>';
    html += '</td></tr><tr><td>&nbsp;</td></tr>';

    $('#rhs-home-daily-events-feed-results > tbody:last').append(html);
}

//start and finish will have one of two formats:
//2013-11-16T13:32:22-06:00         ISO Format
//2013-11-16                        YYYY-MM-DD
function getTimeHtml(start, finish) {
    var sIndexT = start.indexOf('T');
    var fIndexT = finish.indexOf('T');
    var sMoment = moment(start);
    var fMoment = moment(finish);
    var sDate = moment(start).format('dddd, MMMM D');
    var fDate = moment(finish).format('dddd, MMMM D');
    var sTime = moment(start).format('h:mm a');
    var fTime = moment(finish).format('h:mm a');

    //process the start time
    if (sIndexT !== -1) { //process as ISO Format
        sTimeString = moment(start).format('h:mm a');
    }
    //process the finish time
    if (fIndexT !== -1) { //process as ISO Format
        fTimeString = moment(finish).format('h:mm a');
    }

    var diff = fMoment.diff(sMoment, 'days'); //difference in days between start and finish
    if (diff === 1 && sIndexT === -1) { //single all day event, no times
        return sDate;
    } else if (diff === 0 && sIndexT !== -1) { //single day, span of time
        if (sTime === fTime) //start and finish time are the same, no need to show twice (reader will treat this as event with start time only)
            return sDate + ', ' + sTime;
        else
            return sDate + ', ' + sTime + ' to ' + fTime;
    } else if (sDate !== fDate && sIndexT !== -1) { //span across dates + start and finish time
        return sDate + ', ' + sTime + ' to ' + fDate + ', ' + fTime;
    } else //a span of 24-hour events, midnight to midnight (like School & Offices closed over a three day period)
        return sDate + ' to ' + fDate;
}
/** prints 5:55 pm as TBD */
function evalTBD(time) {
    var t = moment(time).format('h:mm a')
    if (t === '5:55 pm')
        return 'TBD';
    else
        return t;
}
function log(msg) {
    if (window.console && console.log) {
        console.log(msg);
    }
}
