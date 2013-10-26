/**
 * FileName:
 *
 * Author:wangyan
 * Date:2013-10-26 14:50
 * Version:V1.0.0.0
 * Email:yywang1991@gmail.com
 * Describe: 请描述本文件功能
 *
 * Change Record:
 * {        date    name    describe}
 *
 */

function uploader(req, res) {
    if (req.xhr) {
        var fs=require('fs');
        var fileName=req.header('x-file-name');
        console.log(fileName);
        var ws=fs.createWriteStream(getfilePath(fileName));
        req.on('data',function(data){
            ws.write(data);
        });
    }
}

function getfilePath(fileName) {
    var basePath = '/UploadFile/';
    var day = new Day();
    var dayStr = day.getFullYear() + '-' + day.getMonth() + '-' + day.getDate();
    return basePath + dayStr + '/' + day.getTime() + '/' + fileName;
}

function index(req, res){
    res.render('file');
}


exports.uploader = uploader;
exports.index=index;

