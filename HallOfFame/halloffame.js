// https://docs.google.com/spreadsheets/d/1l6FPkGBlofyTwfysLFIcdj_oRwmggnKn5tVWjnXxwy4/edit#gid=1691578779

var log = function (msg) {
    console.log(msg);
};

$(document).ready(function () {
    $.get('https://spreadsheets.google.com/feeds/list/1l6FPkGBlofyTwfysLFIcdj_oRwmggnKn5tVWjnXxwy4/1/public/values?alt=json', function (data) {

        // store the hall of famers in a dictionary
        var people = {};

        // parse the cells from google spreadsheet
        data.feed.entry.forEach(function (entry) {
            var name = entry.gsx$name.$t;
            var desc = entry.gsx$description.$t;
            if (desc.length > 0) {
                people[name] = desc;
            }
        });

        // find matching names in the table
        $('td').each(function (index, html) {
            var name = $(this).text();
            if (people.hasOwnProperty(name)) {
                $(this).addClass('rhs-hall-of-fame-link');
                $(this).click(function () {
                    var desc = people[name];
                    $('<div></div>')
                    .text(desc)
                    .dialog({
                        modal: true,
                        title: 'Description',
                        buttons: {
                            Ok: function() {
                                $(this).dialog('destroy').remove();
                            }
                        }
                    });
                });
            }
        });

        // TODO: http://jsfiddle.net/06nLLtbb/1/
        // and also - stop using <a> tags and just click the element...
    });
});