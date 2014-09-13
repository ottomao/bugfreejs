#!/usr/bin/env node

var config = require("./config.json"),
	fs       = require("fs"),
	path     = require("path"),
	isUtf8   = require('is-utf8'),
	buffer   = require("buffer").Buffer;

var commentContent         = fs.readFileSync(path.join(__dirname,"comment_default.txt"),{encoding:"utf8"});
var commentContent_forUTF8 = fs.readFileSync(path.join(__dirname,"comment_default_utf8.txt"),{encoding:"utf8"});
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
		list.forEach(function(item){
			mathcRuleForFile(path.join(target,item));
		});
	}
}

function mathcRuleForFile(filePath){

	//traverse rules
	for (var i = 0 ; i < config.length ; i++){
		var configItem = config[i];

		var reg = new RegExp(config[i].tail);
		if(reg.test(filePath)){
			dealFile(filePath);
			break;
		}
	}
	
	function dealFile(filePath) {

		if(!fs.existsSync(filePath)){
			console.log("file not exist :" + filePath);
		}else{
			fs.readFile(filePath,function(err,data){
				if(err) throw err;

				//add comment prefix
				var commentData = isUtf8(data) ? commentContent_forUTF8 : commentContent;
				var lineArr     = commentData.split("\n");
				lineArr.forEach(function(line,index){
					lineArr[index] = configItem.prefix + line;
				});
				var currentComment  = new Buffer(lineArr.join("\n") + "\n"); //TODO :cache this result

				process.stdout.write("--> " + filePath + "...");
				var finalResult = buffer.concat([currentComment,data]);
				fs.unlinkSync(filePath);
				fs.writeFileSync(filePath,finalResult)
				process.stdout.write("done\r\n");
			});
		}
	}
}

