/*
 * Athletics Calendar Events by J.W. Clark
 * Published for Rockhurst High School
 * December 13, 2013
 * 
 * Required libraries:
 *      Moment.js (http://momentjs.com/)
 *      jQuery (http://jquery.com/)
 *
 * A sample of HTML that uses this code follows:
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
/** called by getCalendar */
function setGoogleCalendarButton(calendarId) {
    var html = '<a href="http://www.google.com/calendar/render?cid=' + calendarId + '" target="_blank"><img src="//www.google.com/calendar/images/ext/gc_button6.gif" border=0></a>';
    $('#calendar-feed').append(html);
}
/** called by getCalendar */
function printFeed(feed) {
    var html = '<table><tr><th style="text-align:left;">Event</th><th style="padding-left: 14px; text-align:left;">Date</th><th style="padding-left: 14px; text-align:left;">Time</th><th style="padding-left: 14px; text-align:left;">Location</th></tr>';
    var entries = feed.entry || [];
    for (var i = 0; i < entries.length; i++) {
        var title = entries[i].title.$t;
        var start = entries[i].gd$when[0].startTime;
        //var end = entries[i].gd$when[0].endTime;
        var description = entries[i].content.$t;
        var location = entries[i].gd$where[0].valueString;
        var link = entries[i].link[0].href;

        html += '<tr>';
        html += '<td><a href="' + link + '" target="_blank">' + title + '</a></td>';
        html += '<td style="padding-left: 14px;">' + moment(start).format('MMM DD') + '</td>';
        html += '<td style="padding-left: 14px;">' + evalTBD(start) + '</td>';
        html += '<td style="padding-left: 14px;"><a href="https://maps.google.com/maps?q=' + location + '&hl=en" target="_blank">' + location + ' </a></td>';
        html += '</tr>';
        if (description.trim().length > 0)
            html += '<tr><td colspan="4">' + description + '</td></tr>';
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
