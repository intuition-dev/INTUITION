"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UploadRoute = (function () {
    function UploadRoute() {
    }
    UploadRoute.prototype.upload = function (req, resp) {
        var uploadPath;
        if (Object.keys(req.files).length == 0) {
            return resp.status(400).send('No files were uploaded.');
        }
        var sampleFile = req.files.sampleFile;
        uploadPath = 'tmp/' + sampleFile.name;
        sampleFile.mv(uploadPath, function (err) {
            if (err)
                return resp.status(500).send(err);
            resp.send('File uploaded!');
        });
    };
    return UploadRoute;
}());
exports.UploadRoute = UploadRoute;
