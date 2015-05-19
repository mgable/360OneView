"use strict";

var fs = require("fs"),
	args = process.argv.slice(2);

	console.info(args);
	rename(args[0]);

function rename(directory){
	var foldAndFiles = fs.readdirSync(directory);
	foldAndFiles.forEach(function(item){
		var directoryOrFileNamePath = directory + "/" + item,
			stats = fs.statSync(directoryOrFileNamePath);

		if (stats.isFile()){
			console.info(item + " is file ");
			if (!/\.json$/.test(item)){
				fs.renameSync(directoryOrFileNamePath, directoryOrFileNamePath + ".json")
			}
		} else if (stats.isDirectory()){
			console.info(item + " is dirctory");
			rename (directoryOrFileNamePath);
		} else {
			console.info(item + " is ignored");
		}
	});
}