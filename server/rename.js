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
			if(/\.json$/.test(i)){
				//console.info("found json %s", i);
				if(/member/.test(i)){
					//console.info("found member %s", i);
					var newName = rename(directoryAndFileName)
					if (newName){
						console.info("renaming %s to %s", i, newName);
						fs.renameSync(directoryAndFileName, newName );
					}
				}
			}
		} else if (stats.isDirectory()){
			readDirectory(directoryAndFileName);
		} else {
			console.info("ignoring " + i);
		}
	});
}

function rename(n){
	if (/\?children=true/.test(n)) return false;
	var name = n.replace(/\.json$/, "");
	name += "?children=true.json";
	return name;
}