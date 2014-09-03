#!/usr/bin/env node

var config = require("./config.json"),
	fs       = require("fs"),
	path     = require("path"),
	buffer   = require("buffer").Buffer;

var commentContent = fs.readFileSync(path.join(__dirname,"comment_default.txt"),{encoding:"utf8"});
console.log("commet template is at :" + __dirname + "\r\njust rewrite it as you wish\r\n");

var targetList = process.argv;
if(targetList[0] == "node"){
	targetList.shift();
}
targetList.shift();

if(targetList.length <= 0){
	console.log("useage : bugfree fileA [fileB [fileC]..]");
	console.log("useage : bugfree dirName");
	process.exit(0);
}

for(var i = 0 ; i < targetList.length ; i++){
	var target = targetList[i],
		stat   = fs.statSync(target);
	if(stat.isFile()){
		mathcRuleForFile(target);
	}
	if(stat.isDirectory()){
		var list = fs.readdirSync(target);
		list.map(function(item){
			mathcRuleForFile(path.join(target,item));
		});
	}
}

function mathcRuleForFile(filePath){
	for (var i = 0 ; i < config.length ; i++){
		var configItem = config[i];

		var reg = new RegExp(config[i].tail);
		if(reg.test(filePath)){

			//add comment prefix
			var lineArr = commentContent.split("\n");
			lineArr.map(function(line,index){
				lineArr[index] = configItem.prefix + line;
			});
			var currentData  = new Buffer(lineArr.join("\n") + "\n"); //TODO :cache this result
			dealFile(filePath,currentData);
			break;
		}
	}
	
}

function dealFile(filePath,prependData) {
	if(!fs.existsSync(filePath)){
		console.log("file not exist :" + filePath);
	}else{
		fs.readFile(filePath,function(err,data){
			if(err) throw err;

			process.stdout.write("--> " + filePath + "...");
			var finalResult = buffer.concat([prependData,data]);
			fs.unlinkSync(filePath);
			fs.writeFileSync(filePath,finalResult)
			process.stdout.write("done\r\n");
		});
	}
}
