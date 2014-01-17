﻿/*
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
var MINIMUM_EVENTS = 4;
var DAYS_TO_SEARCH_FORWARD = 7;

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
     'rockhursths.edu_fpdevts40susg3j1ueoubsrrt8%40group.calendar.google.com',    //Wrestling - Varsity
     'rockhursths.edu_0d2i75kvpcgimrga4lfsihvod4%40group.calendar.google.com',    //Baseball - Varsity
     'rockhursths.edu_qpnh3lidgqcdnjhjmk797igti4%40group.calendar.google.com',    //Golf - Varsity
     'rockhursths.edu_t9rvkvj3jvq11s7u8269nsc14k%40group.calendar.google.com',    //Lacrosse - Varsity
     'rockhursths.edu_odclime8l2bcmde6g8u856sn2s%40group.calendar.google.com',    //Tennis - Varsity
     'rockhursths.edu_nrv610hprus0metm20otq39bks%40group.calendar.google.com'     //Track & Field - Varsity
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
	//so, if results = 46, you still only get 25 entries and the for loop hits null results
	//alternate: ?alt=json&max-results=100&orderby=starttime&sortorder=ascending&singleevents=true
    var numResults = feed.openSearch$totalResults.$t; 
    if (numResults > 25)
        numResults = 25;
    
    for (var i = 0; i < numResults; i++) { //process every entry in the feed
        processEntry(feed.entry[i]);
    }
    if (feedsProcessedCount === CALENDARS.length) { //the ajax requests are complete, sort and print
        printEntries();
    }
}
function processEntry(entry) {
    var e = getEntryBase(entry);
    entries.push(e);
}
function getEntryBase(entry) {
    var e = {};
    e.id = entry.id.$t;
    e.title = entry.title.$t;
    e.location = entry.gd$where[0].valueString;
    e.description = entry.content.$t;
    e.link = entry.link[0].href;
    e.startTime = entry.gd$when[0].startTime;
    e.endTime = entry.gd$when[0].endTime;
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
    var html = '<tr><td><a href="' + entry.link + '" target="_blank">' + entry.title + '</a>'
        + '<br /><span style="color: #666">' + getTimeHtml(entry.startTime, entry.endTime) + '</span>';
    if (entry.description.length > 0)
        html += '<br />' + entry.description;
    if (entry.location.length > 0)
        html += '<br /><a href="https://maps.google.com/maps?q=' + entry.location + '&hl=en" target="_blank">' + entry.location + '</a>';
    html += '</td></tr><tr><td>&nbsp;</td></tr>';

    $('#rhs-home-daily-events-feed-results > tbody:last').append(html);
}
//start and finish will have one of two formats:
//2013-11-16T13:32:22-06:00         ISO Format
//2013-11-16                        YYYY-MM-DD
function getTimeHtml(start, finish) {
    //check if ISO
    var sIndexT = start.indexOf('T');
    var fIndexT = finish.indexOf('T');
    var sMoment = moment(start);
    var fMoment = moment(finish);
	
    if (fMoment.diff(sMoment, 'days') === 1 && sIndexT === -1) { //single all day event, no times
        return sMoment.format('YYYY-MM-DD');
    } else if (fMoment.diff(sMoment, 'days') === 0 && sIndexT !== -1) { //single day, span of time
        if (sMoment.format('h:mm a') === fMoment.format('h:mm a')) //start and finish time are the same, no need to show twice (reader will treat this as event with start time only)
            return sMoment.format('YYYY-MM-DD') + ', ' + sMoment.format('h:mm a');
        else
            return sMoment.format('YYYY-MM-DD') + ', ' + sMoment.format('h:mm a') + ' to ' + fMoment.format('h:mm a');
    } else if (sMoment.format('YYYY-MM-DD') !== fMoment.format('YYYY-MM-DD') && sIndexT !== -1) { //span across dates + start and finish time
        return sMoment.format('YYYY-MM-DD') + ', ' + sMoment.format('h:mm a') + ' to ' + fMoment.format('YYYY-MM-DD') + ', ' + fMoment.format('h:mm a');
    } else //a span of 24-hour events, midnight to midnight (like School & Offices closed over a three day period)
        return sMoment.format('YYYY-MM-DD') + ' to ' + fMoment.format('YYYY-MM-DD');
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