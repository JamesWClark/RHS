/**
 * Rockhurst High School Alumni Hall of Fame 
 *
 * This script grabs the inductees from a Google Sheet and displays them along with modal descriptions
 *
 * https://docs.google.com/spreadsheets/d/1l6FPkGBlofyTwfysLFIcdj_oRwmggnKn5tVWjnXxwy4/edit#gid=701759400
 * Permitted Authors: Robbie Haden, J.W. Clark
 *
 * Works on a DOM that looks like this:
 * 
 * <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.8.0/jquery.modal.min.css">
 * <style>    
 * #hall-of-fame-inductees {
 *     -webkit-column-count: 2; -webkit-column-gap:20px;
 *     -moz-column-count:2; -moz-column-gap:20px;
 *     -o-column-count: 2; -o-column-gap:20px;
 *     column-count: 2; column-gap:20px;
 * }
 * #hall-of-fame-inductees, #hall-of-fame-friends {
 *     list-style-type: none;
 *     padding: 0;
 * }
 * #hall-of-fame-inductees li, #hall-of-fame-friends li {
 *     list-style: none;
 * }
 * </style>
 * 
 * <h1>Alumni</h1>
 * <ul id="hall-of-fame-inductees"></ul>    
 * 
 * <h1>Friends</h1>
 * <ul id="hall-of-fame-friends"></ul>
 * 
 * <div id="modals"></div>
 * 
 * <script src="https://www.rockhursths.edu/Client/Scripts/jquery/1.7.2/jquery.min.js"></script>
 * <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.8.0/jquery.modal.min.js"></script>
 * <script src="halloffame.js"></script>
 */

$(document).ready(function () {
    
    var modals    = $('#modals');
    var inductees = $('#hall-of-fame-inductees');
    var friends   = $('#hall-of-fame-friends');
    
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

    // alumni
    $.get('https://spreadsheets.google.com/feeds/list/1l6FPkGBlofyTwfysLFIcdj_oRwmggnKn5tVWjnXxwy4/oblt4s2/public/values?alt=json', function (data) {
        
        // iterate the cells from inductees worksheet
        data.feed.entry.forEach(function (entry) {
            
            // raw data
            var firstName      = entry.gsx$firstname.$t;
            var lastName       = entry.gsx$lastname.$t;
            var middleName     = entry.gsx$middlename.$t;
            var graduationYear = entry.gsx$graduationyear.$t;
            var inductionYear  = entry.gsx$inductionyear.$t;
            var description    = entry.gsx$description.$t;
            var charterMember  = entry.gsx$chartermember.$t;

            // prepped data
            if(graduationYear.length > 0) graduationYear = '\'' + graduationYear.substring(2);
            if(inductionYear.length > 0) inductionYear = '(' + inductionYear + ')';
            
            // the list item to display
            var display = firstName + ' ' + middleName + ' ' + lastName + ' ' + graduationYear + ' ' + inductionYear;
            if(charterMember.length > 0) display += ' <b>*</b>';
            
            var key = 'h' + display.hashCode();
            
            if(description.length > 0) {
                inductees.append('<li><a href="#' + key + '" rel="modal:open">' + display + '</a></li>');                
                modals.append('<div id="' + key + '" style="display:none;"><h3>' + display + '</h3><hr><p>' + description + '</p></div>')
            } else {
                inductees.append('<li>' + display + '</li>');
            }
        });        
    });
   
    // friends
    $.get('https://spreadsheets.google.com/feeds/list/1l6FPkGBlofyTwfysLFIcdj_oRwmggnKn5tVWjnXxwy4/o7ohepd/public/values?alt=json', function(data) {
        
        // iterate cells from friends worksheet
        data.feed.entry.forEach(function (entry) {
            
            // raw data
            var firstName      = entry.gsx$firstname.$t;
            var lastName       = entry.gsx$lastname.$t;
            var middleName     = entry.gsx$middlename.$t;
            var inductionYear  = entry.gsx$inductionyear.$t;
            var description    = entry.gsx$description.$t;
            var charterMember  = entry.gsx$chartermember.$t;
            
            // prepped data
            if(inductionYear.length > 0) inductionYear = '(' + inductionYear + ')';
            
            // the list item to display
            var display = firstName + ' ' + middleName + ' ' + lastName + ' ' + inductionYear;
            if(charterMember.length > 0) display += ' <b>*</b>';
            
            var key = 'h' + display.hashCode();
            
            if(description.length > 0) {
                friends.append('<li><a href="#' + key + '" rel="modal:open">' + display + '</a></li>');                
                modals.append('<div id="' + key + '" style="display:none;"><h3>' + display + '</h3><hr><p>' + description + '</p></div>')
            } else {
                friends.append('<li>' + display + '</li>');
            }
        });
    });
});