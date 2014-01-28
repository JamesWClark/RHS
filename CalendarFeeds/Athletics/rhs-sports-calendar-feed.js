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
 * <div id="calendar-feed"></div>
 * <script src="https://www.rockhursths.edu/file/admin---webdev-documents/moment.min.js"></script>
 * <script src="https://www.rockhursths.edu/file/admin---webdev-documents/jw-clark---web-assets/rhs-sports-calendar-feed.js"></script>
 * <script>
 * 
 *     var calendarId = 'rockhursths.edu_fpdevts40susg3j1ueoubsrrt8@group.calendar.google.com'; //get this value from calendar settings
 *     var startMin = '2013-11-01'; //YYYY-MM-DD  <-- mandatory format
 *     var startMax = '2014-04-01'; //YYYY-MM-DD  <-- mandatory format
 * 
 *     $(document).ready(getCalendar(calendarId, startMin, startMax));
 * 
 * </script>
 * <noscript>
 *     It seems JavaScript is disabled in your web browser. You may find the same information in the Master Calendar under Quick Links.
 * </noscript>
 */

var maxResults = 100;
var timePlaceholder = '5:55 pm'; //any time that matches this will print as TBD
var unknownLocation = '???'; //if this is encountered in the location field, the hyperlink will be removed

/** called by document.ready */
function getCalendar(calendarId, startMin, startMax) {
    var https = 'https://www.google.com/calendar/feeds/' + calendarId
    + '/public/full?alt=json&max-results=' + maxResults + '&orderby=starttime&sortorder=ascending&singleevents=true&start-min=' + startMin + '&start-max=' + startMax;
    $.ajax({
        url: https,
        dataType: 'jsonp',
        type: "GET",
        success: function (response) {
            printFeed(response.feed);
        }
    });
}
/** called by printFeed */
function setGoogleCalendarButton(calendarId) {
    var html = '<a href="http://www.google.com/calendar/render?cid=' + calendarId + '" target="_blank"><img src="//www.google.com/calendar/images/ext/gc_button6.gif" border=0></a>';
    $('#calendar-feed').append(html);
}
/** called by getCalendar */
function printFeed(feed) {
    var html = '<table id="rhs-sports-calendar-feed-table"><tr><th>Event</th><th>Date</th><th>Time</th><th>Location</th></tr>';
    var entries = feed.entry || [];
    for (var i = 0; i < entries.length; i++) {
        var title = entries[i].title.$t;
        var start = entries[i].gd$when[0].startTime;
        //var end = entries[i].gd$when[0].endTime;
        var description = entries[i].content.$t;
        var location = entries[i].gd$where[0].valueString;
        var link = entries[i].link[0].href;

        var marginRow = '<tr class="rhs-sports-calendar-feed-margin-row">';
        html += '<tr>';
        html += '<td><a href="' + link + '" target="_blank">' + title + '</a></td>';
        html += '<td>' + moment(start).format('MMM DD') + '</td>';
        html += '<td>' + evalTBD(start) + '</td>';
        if (location === unknownLocation)
            html += '<td>' + location + '</td>';
        else
            html += '<td><a href="https://maps.google.com/maps?q=' + location + '&hl=en" target="_blank">' + location + ' </a></td>';
        html += '</tr>';
        if (description.trim().length > 0)
            html += '<tr><td colspan="4">' + description + '</td></tr>';
        html += '<tr class="rhs-sports-calendar-feed-table-row-spacer"><td colspan="4"></td></tr>';

    }
    html += '</table><br />';
    $('#calendar-feed').append(html);
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
