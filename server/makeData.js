"use strict";
var fs = require("fs");
var args = process.argv.slice(2);
var path = args[0];
var root = path.split("/").pop()
var results = {};
	results[root] = {};

makeData(path, results[root]);

function makeData(directory, obj){
	readFiles(directory, obj);

	function readFiles(directory, obj){
		var contents = fs.readdirSync(directory);
		contents.forEach(function(i){
			var directoryAndFileName = directory + "/" + i,
				stats = (fs.statSync(directoryAndFileName));
			if(stats.isFile()){
				if(/\.json$/.test(i)){
					if (/\.DS_Store\.json/.test(i)){
						console.info("deleting %s", directoryAndFileName);
						fs.unlinkSync(directoryAndFileName);
					} else {
						console.info("opening " + directoryAndFileName );
						obj[i] = JSON.parse(fs.readFileSync(directoryAndFileName, 'utf8'));
					}
				}
			} else if (stats.isDirectory()){
				obj[i] = {};
				readFiles(directoryAndFileName, obj[i]);
			} else {
				console.info("ignoring " + i);
			}
		});
	}
	console.info(results);
	fs.writeFileSync("./marketshare/data.json", JSON.stringify(results));
}
