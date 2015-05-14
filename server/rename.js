"use strict";
var fs = require("fs");
var args = process.argv.slice(2);

readDirectory(args[0]);

function readDirectory(directory){
	var contents = fs.readdirSync(directory);
	contents.forEach(function(i){
		var directoryAndFileName = directory + "/" + i,
			stats = (fs.statSync(directoryAndFileName));
		if(stats.isFile()){
			if(!/\.json$/.test(i)){
				console.info("renaming " + i );
				fs.renameSync(directoryAndFileName, directoryAndFileName + ".json");
			}
		} else if (stats.isDirectory()){
			readDirectory(directoryAndFileName);
		} else {
			console.info("ignoring " + i);
		}
	});
}
