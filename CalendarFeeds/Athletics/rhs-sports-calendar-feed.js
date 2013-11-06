var calendarId = 'rockhursths.edu_89fbs6i2rm7qncgk5ttjd95uao@group.calendar.google.com';
var startMin = '2013-11-01'; //YYYY-MM-DD  <-- mandatory format
var startMax = '2014-04-31'; //YYYY-MM-DD  <-- mandatory format


$(document).ready(function () {
    var https = 'https://www.google.com/calendar/feeds/' + calendarId
        + '/public/full?alt=json&max-results=100&orderby=starttime&sortorder=ascending&singleevents=true&start-min=' + startMin + '&start-max=' + startMax;
    $.ajax({
        url: https,
        dataType: 'jsonp',
        type: "GET",
        success: function (response) {
            printFeed(response.feed);
        }
    });
});
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
    html += '</table>';
    $('#calendar-feed').html(html);
}
function evalTBD(time) {
    var t = moment(time).format('h:mm a')
    if (t === '5:55 pm')
        return 'TBD';
    else
        return t;
}
