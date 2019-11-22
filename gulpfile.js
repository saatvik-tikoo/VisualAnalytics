var gulp = require('gulp');
var fs = require('fs');

//  Make a rest call to get all the data
//  Write two for loops and generate the whole structure and save it in a list and push that list to file
gulp.task('createDataFile', function () {
    fs.readFile('./cleanData.json', function (err, data) {
        if (err) throw err;
        jsonData = JSON.parse(data);
        var result = [];
        var names = ['Similar Values', 'Different Values without any NA', 'Different values with NA'];
        
        for (var i = 0; i < 3; i++) {
            data_structure = {
                name: names[i],
                children: []
            };
            result.push(data_structure);
        }
        var group_names = ['Followers Less than 100', 'Followers between 100 and 500',
            'Followers between 500 and 1000', 'Followers between 1000 and 10000', 'Followers greater than 10000'];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 5; j++) {
                data_structure = {
                    name: group_names[j],
                    children: []
                };
                result[i]['children'].push(data_structure)
            }
        }
        var connectivity_names = ['Lowely Connected Nodes', 'Highly Connected Nodes'];
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 5; j++) {
                for(var k = 0; k < 2; k++){
                    data_structure = {
                        name: connectivity_names[k],
                        children: []
                    };
                    result[i]['children'][j]['children'].push(data_structure)
                }
            }
        }
        for(var i = 0; i < jsonData.length; i++){
            if(jsonData[i].mTurk == jsonData[i].stanford){
                if(jsonData[i].followers < 100){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[0]['children'][0]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[0]['children'][0]['children'][1]['children'].push(jsonData[i])
                    }                    
                } else if(100 <= jsonData[i].followers && jsonData[i].followers < 500){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[0]['children'][1]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[0]['children'][1]['children'][1]['children'].push(jsonData[i])
                    }
                } else if(500 <= jsonData[i].followers && jsonData[i].followers < 1000){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[0]['children'][2]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[0]['children'][2]['children'][1]['children'].push(jsonData[i])
                    }
                } else if(1000 <= jsonData[i].followers && jsonData[i].followers < 10000){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[0]['children'][3]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[0]['children'][3]['children'][1]['children'].push(jsonData[i])
                    }
                } else if(10000 <= jsonData[i].followers){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[0]['children'][4]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[0]['children'][4]['children'][1]['children'].push(jsonData[i])
                    }
                }
            } else if(jsonData[i].mTurk != jsonData[i].stanford && jsonData[i].stanford != 'N/A'){
                if(jsonData[i].followers < 100){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[1]['children'][0]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[1]['children'][0]['children'][1]['children'].push(jsonData[i])
                    }                    
                } else if(100 <= jsonData[i].followers && jsonData[i].followers < 500){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[1]['children'][1]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[1]['children'][1]['children'][1]['children'].push(jsonData[i])
                    }
                } else if(500 <= jsonData[i].followers && jsonData[i].followers < 1000){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[1]['children'][2]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[1]['children'][2]['children'][1]['children'].push(jsonData[i])
                    }
                } else if(1000 <= jsonData[i].followers && jsonData[i].followers < 10000){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[1]['children'][3]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[1]['children'][3]['children'][1]['children'].push(jsonData[i])
                    }
                } else if(10000 <= jsonData[i].followers){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[1]['children'][4]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[1]['children'][4]['children'][1]['children'].push(jsonData[i])
                    }
                }
            } else if(jsonData[i].mTurk != jsonData[i].stanford && jsonData[i].stanford == 'N/A'){
                if(jsonData[i].followers < 100){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[2]['children'][0]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[2]['children'][0]['children'][1]['children'].push(jsonData[i])
                    }                    
                } else if(100 <= jsonData[i].followers && jsonData[i].followers < 500){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[2]['children'][1]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[2]['children'][1]['children'][1]['children'].push(jsonData[i])
                    }
                } else if(500 <= jsonData[i].followers && jsonData[i].followers < 1000){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[2]['children'][2]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[2]['children'][2]['children'][1]['children'].push(jsonData[i])
                    }
                } else if(1000 <= jsonData[i].followers && jsonData[i].followers < 10000){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[2]['children'][3]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[2]['children'][3]['children'][1]['children'].push(jsonData[i])
                    }
                } else if(10000 <= jsonData[i].followers){
                    if(jsonData[i].totalTimesRetweeted / jsonData[i].followers <= 0.05){
                        result[2]['children'][4]['children'][0]['children'].push(jsonData[i])
                    } else {
                        result[2]['children'][4]['children'][1]['children'].push(jsonData[i])
                    }
                }
            }
        }
        
        fs.writeFile('./mainData.json', JSON.stringify(result), (err) => {
            if (err) throw err;
        });
    });
});