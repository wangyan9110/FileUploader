/**
 * FileName:
 *
 * Author:wangyan
 * Date:2013-10-26 14:50
 * Version:V1.0.0.0
 * Email:yywang1991@gmail.com
 * Describe:   文件上传类
 * Change Record:
 * {        date    name    describe}
 *
 */

var fs = require('fs');
var utils = require('../utils/fileUtils');
var promise = require('promise');

function uploader(req, res) {
    if (req.files != 'undifined') {
        var tempPath = req.files.file[0].path;
        var name = req.files.file[0].name;
        if (tempPath) {
            utils.mkDir().then(function (path) {
                var rename = promise.denodeify(fs.rename);
                rename(tempPath, path + name);
            }).then(function () {
                    var unlink = promise.denodeify(fs.unlink);
                    unlink(tempPath);
                }).then(function () {
                    res.send('{code:1,des:"上传成功"}');
                });
        }
    }
}

function sendUploadSuccess(res) {
    res.send('{code:1,des:"上传成功"}');
}

function sendUploadFailed(res) {
    res.send('{code:0,des:"上传失败"}');
}

function index(req, res) {
    res.render('file');
}


exports.uploader = uploader;
exports.index = index;

