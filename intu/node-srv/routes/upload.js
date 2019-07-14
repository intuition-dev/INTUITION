class Upload {
    upload(req, resp) {
        let mountPath = resp.locals.mountPath;
        let uploadPath;
        if (Object.keys(req.files).length == 0) {
            return resp.status(400).send('No files were uploaded.');
        }
        let sampleFile = req.files.sampleFile;
        uploadPath = 'tmp/' + sampleFile.name;
        sampleFile.mv(uploadPath, function (err) {
            if (err)
                return resp.status(500).send(err);
            resp.send('File uploaded!');
        });
    }
}
