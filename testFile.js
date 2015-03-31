//  
//                                  _oo8oo_
//                                 o8888888o
//                                 88" . "88
//                                 (| -_- |)
//                                 0\  =  /0
//                               ___/'==='\___
//                             .' \\|     |// '.
//                            / \\|||  :  |||// \
//                           / _||||| -:- |||||_ \
//                          |   | \\\  -  /// |   |
//                          | \_|  ''\---/''  |_/ |
//                          \  .-\__  '-'  __/-.  /
//                        ___'. .'  /--.--\  '. .'___
//                     ."" '<  '.___\_<|>_/___.'  >' "".
//                    | | :  `- \`.:`\ _ /`:.`/ -`  : | |
//                    \  \ `-.   \_ __\ /__ _/   .-` /  /
//                =====`-.____`.___ \_____/ ___.`____.-`=====
//                                  `=---=`
//  
//  
//       ~~~~~~~Powered by https://github.com/ottomao/bugfreejs~~~~~~~
// 
//                          佛祖保佑         永无bug
//                          
function dealFile(filePath) {

	if(!fs.existsSync(filePath)){
		console.log("file not exist :" + filePath);
	}else{
		fs.readFile(filePath,function(err,data){
			if(err) throw err;

			//add comment prefix
			var commentData = isUtf8(data) ? commentContent_forUTF8 : commentContent;
			var lineArr     = commentData.split("\n");
			lineArr.map(function(line,index){
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