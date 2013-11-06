/*
 * Daily Events by J.W. Clark
 * Published for Rockhurst High School
 * July 17, 2013
 *
 * 1. get a series of feeds from a list of google calendars
 * 2. if today has less than 4 events, continue searching forward until at least 4 events are found.
 * 3. the search will end at the end of the feed
 *
 * https://github.com/JamesWClark/PythonAppEngine/blob/master/static/rhs/calendar/daily-events/daily-events-rhs-school-calendar.js
 */

//VARIABLES
var processBegin = new Date().getMilliseconds();

var debug = false;

//jQuery.support.cors = true;

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

var today = new Date();
var startMin = getQueryStringDate(today);
var now = new Date(today);
var startMax = getQueryStringDate(now.setDate(now.getDate() + DAYS_TO_SEARCH_FORWARD));

$(document).ready(init());

function init() {
    log('init() called by document.ready event');
    log('minimum events = ' + MINIMUM_EVENTS);
    log('days to search forward = ' + DAYS_TO_SEARCH_FORWARD);
    log('today = ' + today);
    log('processing ' + CALENDARS.length + ' calendars');
    getCalendarFeeds();
}
function getCalendarFeeds() {
    log('getCalendarFeeds() called by ' + getCalendarFeeds.caller.name);
    log('setting startMin and startMax values for ajax request query parameters');
    log('startMin = ' + startMin + ', and startMax = ' + startMax);
    log('now calling CALENDARS.length = ' + CALENDARS.length + ' ajax requests');

    for (var i = 0; i < CALENDARS.length; i++) {
        var https = 'https://www.google.com/calendar/feeds/' + CALENDARS[i] + '/public/full?alt=json&orderby=starttime&sortorder=ascending&singleevents=true&start-min=' + startMin + '&start-max=' + startMax;
        log('request ' + i + ': ' + https);
        $.ajax({
            url: https,
            dataType: 'jsonp',
            type: "GET",
            success: function (response) {
                log('successful return by ajax request');
                processFeed(response.feed);
            }
        });
    }
}

function getQueryStringDate(date) {
    log('getQueryStringDate(' + date + ') called by ');
    var d = new Date(date);
    d.dd = d.getDate();
    d.mm = d.getMonth() + 1; //January is 0!
    d.yyyy = d.getFullYear();
    if (d.dd < 10) d.dd = '0' + d.dd;
    if (d.mm < 10) d.mm = '0' + d.mm;
    d.toString = function () {
        return d.yyyy + "-" + d.mm + '-' + d.dd;
    }
    log('returning d = ' + d);
    return d;
}
function processFeed(feed) {
    feedsProcessedCount++;

    var numResults = feed.openSearch$totalResults.$t; //why? google automatically injects the max-results=25 parameter into the calendar query
    if (numResults > 25)
        numResults = 25;

    log('processFeed(feed) called by ' + processFeed.caller.name);
    log(feed.title.$t + ' (feed) = ' + feed.link[3].href);
    log('feedsProcessedCount = ' + feedsProcessedCount);
    log('this feed has ' + feed.openSearch$totalResults.$t + ' total results');
    log('looping feed results from i = 0 to i = ' + numResults);
    
    for (var i = 0; i < numResults; i++) { //process every entry in the feed
        log('processing entry[' + i + ']');
        processEntry(feed.entry[i]);
    }
    if (feedsProcessedCount === CALENDARS.length) { //the ajax requests are complete, sort and print
        log('feedsProcessedCount = ' + feedsProcessedCount + ', CALENDARS.length = ' + CALENDARS.length);
        log('therefore, all ajax requests have returned, now sorting and listing');
        $('#rhs-home-daily-events').html('');
        printEntries();
    }
}
function processEntry(entry) {
    log('processEntry(entry) called by ' + processEntry.caller.name);

    if (entry.hasOwnProperty("gd$recurrence")) {
        log('entry has gd$recurrence');
        processAsRecurringEntry(entry);
    } else if (entry.hasOwnProperty("gd$originalEvent")) {
        log('entry has gd$originalEvent');
        processAsReplacementEntry(entry);
    } else {
        log('entry is singleton');
        processAsSingleEntry(entry);
    }
}
function processAsRecurringEntry(entry) {
    log('processAsRecurringEntry(entry) called by ' + processAsRecurringEntry.caller.name);

    var when = entry.gd$when;
    log('recurring entry with when.length = ' + when.length);
    for (var i = 0; i < when.length; i++) {
        var e = getEntryBase(entry);
        e.startTime = entry.gd$when[i].startTime;
        e.endTime = entry.gd$when[i].endTime;

        log('entry.startTime = ' + e.startTime);
        log('entry.endTime = ' + e.endTime);

        validateEntry(e);
    }
}
function processAsReplacementEntry(entry) {
    log('processAsReplacementEntry(entry) called by ' + processAsReplacementEntry.caller.name);
    var e = getEntryBase(entry);
    e.startTime = entry.gd$when[0].startTime;
    e.endTime = entry.gd$when[0].endTime;
    e.update = new Object();
    e.update.id = entry.gd$originalEvent.id;
    e.update.startTime = entry.gd$originalEvent.gd$when.startTime;

    log('entry.startTime = ' + e.startTime);
    log('entry.endTime = ' + e.endTime);
    log('entry.update.id = ' + e.update.id);
    log('entry.update.startTime = ' + e.update.startTime);

    if (validateEntry(e) === true)
        updateEntry(validEntries, e);
    else
        updateEntry(extraEntries, e);
}
function processAsSingleEntry(entry) {
    log('processAsSingleEntry(entry) called by ' + processAsSingleEntry.caller.name);
    var e = getEntryBase(entry);
    e.startTime = entry.gd$when[0].startTime;
    e.endTime = entry.gd$when[0].endTime;

    log('entry.startTime = ' + e.startTime);
    log('entry.endTime = ' + e.endTime);

    validateEntry(e);
}
function getEntryBase(entry) {
    var e = new Object();
    e.id = entry.id.$t;
    e.title = entry.title.$t;
    e.location = entry.gd$where[0].valueString;
    e.description = entry.content.$t;
    e.link = entry.link[0].href;

    log('entry.id = ' + e.id);
    log('entry.title = ' + e.title);
    log('entry.location = ' + e.location);
    log('entry.description = ' + e.description);
    log('entry.link = ' + e.link);

    return e;
}
function validateEntry(entry) { //returns boolean
    //compare on day, month, year only
    var start = new Date(entry.startTime);
    var end = new Date(entry.endTime);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (end - start === 86400000) // a little hack for dealing with the following day being a 24 hour all day event with a midnight start time that would otherwise validate
        start = end;

    log('checking if ' + end + ' <= ' + today + ' <= ' + start);

    if (start <= today && today <= end) {
        log('YES - pushing this entry to valid entries list');
        validEntries.push(entry);
        dailyEventsCount++;
        log('validEntries.length = ' + validEntries.length + ', dailyEventsCount = ' + dailyEventsCount);
        return true;
    } else {
        log('NO - ' + today + ' (today) is outside of startTime ' + entry.startTime + ' to endTime ' + entry.endTime);
        extraEntries.push(entry);
        log('extraEntries.length = ' + extraEntries.length);
        return false;
    }
}
function updateEntry(entries, entry) {
    log('updateEntry(entries, entry) called by ' + updateEntry.caller.name);

    for (var i = 0; i < entries.length; i++) {
        log('comparing for update call');
        log('entries[i].startTime = ' + entries[i].startTime);
        log('entry.update.startTime = ' + entry.update.startTime);
        log('entries[i].id = ' + entries[i].id.toString().split("/full/")[1]);
        log('entry.update.id = ' + entry.update.id);
        if (entries[i].startTime === entry.update.startTime && entries[i].id.toString().split("/full/")[1] === entry.update.id) {
            log('found original event, updating object');
            entries[i] = entry;
            entries.pop(); //why pop? the last action on the array was a push before this inspection, so pop simply removes the item ... otherwise it will appear twice in the list
        }
        log('failed to update on ID = ' + entries[i].id.toString().split("/full/")[1]);

    }
}
function printEntries() {
    log('printEntries() called by ' + printEntries.caller.name)
    log('validEntries.length = ' + validEntries.length + ', extraEntries.length = ' + extraEntries.length);
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
    log('all done!');
    log('validEntries.length = ' + validEntries.length);
    var processEnd = new Date().getMilliseconds();
    log('time to completion: ' + (processEnd - processBegin) + ' milliseconds');
}
function sortEntries(entries) {
    log('sortEntries(entries) called by ' + sortEntries.caller.name);
    entries.sort(function (a, b) {
        var x = a["startTime"];
        var y = b["startTime"];
        log('comparing x = ' + x + ' to y = ' + y + ', returning as ' + ((x < y) ? -1 : ((x > y) ? 1 : 0)));
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}
function writeHtml(entry) {
    //this function writes HTML to the DOM on a per calendar entry basis
    //modify the object in the processEntry() method before pulling its properties here
    log('writeHTML(entry) called by ' + writeHtml.caller.name);
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
    log('getTimeHtml(' + start + ',' + finish + ') called by ' + getTimeHtml.caller.name);

    //start and finish can be of two formats: 1) 2013-07-07, or 2) 2013-07-07T00:00:00.000Z (ISO Format)
    //new Date('2013-07-07') equals July 6, and new Date('2013-07-01') equals June 30
    //this is a big difference in how to process ISO Format versus YYYY-MM-DD format

    var sIndexT = start.indexOf('T');
    var fIndexT = finish.indexOf('T');
    var sTimeString;
    var fTimeString;
    var sDateString;
    var fDateString;

    //process the start time
    if (sIndexT !== -1) { //process as ISO Format
        sDateString = getDateString(start);
        sTimeString = getTimeString(start);
    } else { //process as YYYY-MM-DD
        sDateString = new Date(start);
        sDateString.setDate(sDateString.getDate() + 1);
        sDateString = getDateString(sDateString);
    }

    //process the finish time
    if (fIndexT !== -1) { //process as ISO Format
        fDateString = getDateString(finish);
        fTimeString = getTimeString(finish)
    } else { //process as YYYY-MM-DD
        fDateString = getDateString(finish);
    }

    log('figuring how to print, knowing: ');
    log('    sIndexT = ' + sIndexT);
    log('    fIndexT = ' + fIndexT);
    log('    sDateString = ' + sDateString);
    log('    fDateString = ' + fDateString);
    log('    sTimeString = ' + sTimeString);
    log('    fTimeString = ' + fTimeString);

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
function getDateString(date) {
    log('getDateString(' + date + ') called by ' + getDateString.caller.name);
    var d = new Date(date);
    var day = d.getDay();
    var date = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    switch (day) {
        case 0: day = 'Sunday'; break;
        case 1: day = 'Monday'; break;
        case 2: day = 'Tuesday'; break;
        case 3: day = 'Wednesday'; break;
        case 4: day = 'Thursday'; break;
        case 5: day = 'Friday'; break;
        case 6: day = 'Saturday'; break;
        default: day = ''; break;
    }
    switch (month) {
        case 0: month = 'January'; break;
        case 1: month = 'February'; break;
        case 2: month = 'March'; break;
        case 3: month = 'April'; break;
        case 4: month = 'May'; break;
        case 5: month = 'June'; break;
        case 6: month = 'July'; break;
        case 7: month = 'August'; break;
        case 8: month = 'September'; break;
        case 9: month = 'October'; break;
        case 10: month = 'November'; break;
        case 11: month = 'December'; break;
        default: month = ''; break;
    }
    log('returning ' + day + ', ' + month + ' ' + date);
    return day + ', ' + month + ' ' + date;
}
function getTimeString(datetime) {
    log('getTimeString(' + datetime + ') called by ' + getTimeString.caller.name);
    var ampm;
    var t = new Date(datetime);
    var hour = t.getHours();
    if (hour === 0) hour = 12;
    var minute = t.getMinutes();
    if (minute < 10) minute = '0' + minute;
    if (hour > 12) {
        hour = hour - 12;
        ampm = 'p.m.';
    } else {
        ampm = 'a.m.';
    }
    log('returning ' + hour + ":" + minute + ' ' + ampm);
    if (hour === 5 && minute === 55)
        return 'TBD';
    else
        return hour + ":" + minute + ' ' + ampm;
}
function log(msg) {
    if (window.console && console.log && debug) {
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