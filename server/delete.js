var fs = require("fs");
var args = process.argv.slice(2);

readDirectory(args[0]);

function readDirectory(directory){
	var contents = fs.readdirSync(directory);
	//console.info(contents);
	contents.forEach(function(i){
		var directoryAndFileName = directory + "/" + i,
			stats = (fs.statSync(directoryAndFileName));
		if(stats.isFile()){
			if(/\?children=true\?children=true\.json$/.test(i)){
				console.info("deleting %s", i);
				fs.unlinkSync(directoryAndFileName);
			}
		} else if (stats.isDirectory()){
			readDirectory(directoryAndFileName);
		} else {
			console.info("ignoring " + i);
		}
	});
}
