/**
 * Rockhurst High School Alumni Hall of Fame 
 *
 * This script grabs the inductees from a Google Sheet and displays them along with modal descriptions
 *
 * https://docs.google.com/spreadsheets/d/1l6FPkGBlofyTwfysLFIcdj_oRwmggnKn5tVWjnXxwy4/edit#gid=701759400
 * Permitted Authors: Robbie Haden, J.W. Clark
 */

$(document).ready(function () {
    
    // http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
    String.prototype.hashCode = function(){
        var hash = 0;
        if (this.length == 0) return hash;
        for (var i = 0; i < this.length; i++) {
            var c = this.charCodeAt(i);
            hash = ((hash<<5)-hash)+c;
            hash = hash & hash; // Convert to 32bit integer
        }
        return hash;
    }

    $.get('https://spreadsheets.google.com/feeds/list/1l6FPkGBlofyTwfysLFIcdj_oRwmggnKn5tVWjnXxwy4/oblt4s2/public/values?alt=json', function (data) {

        var modals = $('#modals');
        var inductees = $('#hall-of-fame-inductees');
        
        
        // iterate the cells from inductees worksheet
        data.feed.entry.forEach(function (entry) {
            // raw data
            var firstName      = entry.gsx$firstname.$t;
            var lastName       = entry.gsx$lastname.$t;
            var middleName     = entry.gsx$middlename.$t;
            var graduationYear = entry.gsx$graduationyear.$t;
            var inductionYear  = entry.gsx$inductionyear.$t;
            var description    = entry.gsx$description.$t;

            // prepped data
            if(graduationYear.length > 0) graduationYear = '\'' + graduationYear.substring(2);
            if(inductionYear.length > 0) inductionYear = '(' + inductionYear + ')';
            
            // the list item to display
            var display = firstName + ' ' + middleName + ' ' + lastName + ' ' + graduationYear + ' ' + inductionYear;
            var key = 'h' + display.hashCode();
            
            if(description.length > 0) {
                inductees.append('<li><a href="#' + key + '" rel="modal:open">' + display + '</a></li>');                
                modals.append('<div id="' + key + '" style="display:none;"><h3>' + display + '</h3><hr><p>' + description + '</p></div>')
            } else {
                inductees.append('<li>' + display + '</li>');
            }
        });
        
        // iterate cells from friends worksheet
        
    });
});