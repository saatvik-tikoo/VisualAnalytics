var gulp = require('gulp');
var fs = require('fs');

//  Make a rest call to get all the data
//  Write two for loops and generate the whole structure and save it in a list and push that list to file
gulp.task('createDataFile', function() {
    $.ajax({
        url: 'http://localhost:3000/gamergate',
        async: true,
        method: 'GET',
        contentType: 'application/json',
        success: function (response) {
            console.log(response.length)
        }
    });
  });