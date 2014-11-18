/*
 * Athletics Google Calendar Events by J.W. Clark
 * Published for Rockhurst High School
 * Last Update: January 24, 2014
 * 
 * Required libraries:
 *      Moment.js (http://momentjs.com/)
 *      jQuery (http://jquery.com/)
 *
 * A sample of HTML that uses this code:
 *
 * <div id="calendar-feed-select-container">
 *     <p><select id="calendar-feed-select" onchange="updateCalendar(this);"></select></p>
 * </div>
 * <div id="calendar-feed"></div>
 * <script src="https://www.rockhursths.edu/file/admin---webdev-documents/moment.min.js"></script>
 * <script src="https://www.rockhursths.edu/file/admin---webdev-documents/jw-clark---web-assets/rhs-sports-calendar-feed.js"></script>
 * <script>
 *
 *     var calendarId = 'rockhursths.edu_ltou5f03c1snr1seu9e107r8i0@group.calendar.google.com'; //get this value from calendar settings
 *     var earliestYear = 2013; //the first year Google Calendar was implemented for this organization
 *     var season = 'Winter'; //options: Spring, Winter, Summer, Fall
 *
 *     $(document).ready(init());
 *
 * </script>
 * <noscript>
 *     It seems JavaScript is disabled in your web browser. You may find the same information in the Master Calendar under Quick Links.
 * </noscript>
 */

var KEY = 'AIzaSyDU1yMxRcZrs8M_dT9SeLxs6hT7Nzmqjyk'; //get from calendar@rockhursths.edu account, google developer api console
//var maxResults = 100; //i think the new limit is default @ 250
var timePlaceholder = '5:55 pm'; //any time that matches this will print as TBD
var unknown_location_placeholders_array = ['?','??','???','????','?????','tbd','TBD','unknown','undefined']; //if any of these are encountered in the location field, the hyperlink will be removed
var rolloverDate = "05-21"; //format as MM-DD, when the year rolls over on this MM-DD date, the calendars pivot for client display
var startMin;
var startMax;

/** called by document.ready */
function getCalendar(calendarId) {
    var https = 'https://www.googleapis.com/calendar/v3/calendars/' + calendarId + '/events?singleEvents=true&orderBy=startTime&sortOrder=ascending&timeMin=' + moment(startMin).format() + '&timeMax=' + moment(startMax).format() + '&key=' + KEY;
    $.getJSON(https, function (response) {
        printFeed(response);
    });
}
/** called one time by $(document).ready() */
function init() {
    var calStartYear; //display range start
    var calFinishYear; //display range finish
    var now = moment(); //at time of client visit
    var currentYear = parseInt(moment(now).format("YYYY")); //at time of client visit
    var start = moment(currentYear + "-" + rolloverDate); //rollover start
    var finish = moment(start).add('years', 1); //rollover finish
    var roll = currentYear + "-" + rolloverDate;
    var isRollover = now.diff(roll) < 0;

    if (isRollover) {
        calStartYear = currentYear - 1;
        calFinishYear = currentYear;
    } else {
        calStartYear = currentYear;
        calFinishYear = currentYear + 1;
    }

    setMinMax(calStartYear, calFinishYear);
    setSelectOptions(calStartYear, calFinishYear);
    getCalendar(calendarId);
}
/** one time call by setCurrent()
 *  multiple calls for every select option change event
 */
function setMinMax(calStartYear, calFinishYear) {
    switch (season.toLowerCase()) {
        case "winter":
            startMin = calStartYear + "-11-01";
            startMax = calFinishYear + "-04-15";
            break;
        case "spring":
            startMin = calFinishYear + "-01-01";
            startMax = calFinishYear + "-06-15";
            break;
        case "fall":
            startMin = calStartYear + "-08-01";
            startMax = calStartYear + "-12-31";
            break;
    }
}
/** called by setCurrent */
function setSelectOptions(calStartYear, calFinishYear) {
    var list = $('#calendar-feed-select');
    var counter = calStartYear;
    while (counter > earliestYear-1) {
        var text = counter + "-" + (1+counter).toString().slice(-2);
        var value = counter--;
        $(list).append($('<option>', {
            value: value,
            text: text
        }));
    }
}
/** called by printFeed */
function setGoogleCalendarButton(calendarId) {
    var html = '<a href="http://www.google.com/calendar/render?cid=' + calendarId + '" target="_blank"><img src="//www.google.com/calendar/images/ext/gc_button6.gif" border=0></a>';
    $('#calendar-feed').append(html);
}
/** called by getCalendar */
function printFeed(feed) {
    var html = '<table id="rhs-sports-calendar-feed-table"><tr><th>Event</th><th>Date</th><th>Time</th><th>Location</th></tr>';
    var entries = feed['items'] || [];
    for (var i in entries) {
        var e = {};
        e.id = entries[i].id;
        e.title = entries[i].summary;
        e.location = entries[i].location;
        e.description = entries[i].description;
        e.link = entries[i].htmlLink;
        var start = entries[i].start;
        var end = entries[i].end;
        if (start.hasOwnProperty('date')) {
            e.start = entries[i].start.date;
        } else {
            e.start = entries[i].start.dateTime; //assumption: has dateTime
        }
        /*if (end.hasOwnProperty('date')) {
            e.endTime = entry.end.date;
        } else {
            e.endTime = entry.end.dateTime; //assumption: has dateTime
        }*/

        var marginRow = '<tr class="rhs-sports-calendar-feed-margin-row">';
        html += '<tr>';
        html += '<td><a href="' + e.link + '" target="_blank">' + e.title + '</a></td>';
        html += '<td>' + moment(e.start).format('MMM DD') + '</td>';
        html += '<td>' + evalTBD(e.start) + '</td>';
        if (e.location && e.location.trim().length > 0) {
            if (unknown_location_placeholders_array.indexOf(e.location) > -1) //don't show map if text matches the unknownlocations list
                html += '<td>TBD</td>';
            else
                html += '<td><a href="https://maps.google.com/maps?q=' + e.location + '&hl=en" target="_blank">' + e.location + ' </a></td>';
        }
        html += '</tr>';
        if (e.description && e.description.trim().length > 0)
            html += '<tr><td colspan="4">' + e.description + '</td></tr>';
        html += '<tr class="rhs-sports-calendar-feed-table-row-spacer"><td colspan="4"></td></tr>';
    }
    html += '</table><br />';
    $('#calendar-feed').html(html);
    setGoogleCalendarButton(calendarId);
}
/** called by printFeed */
function evalTBD(time) {
    var t = moment(time).format('h:mm a')
    if (t === timePlaceholder)
        return 'TBD';
    else
        return t;
}
/** called by #calendar-feed-select onchange event */
function updateCalendar(option) {
    setMinMax(option.value, 1 + parseInt(option.value));
    getCalendar(calendarId);
}
