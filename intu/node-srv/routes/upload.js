class Upload {
    upload(req, resp) {
        return this.iauth.auth(user, pswd, resp).then(auth => {
            if (auth === 'admin' || auth === 'editor') {
                let mountPath = resp.locals.mountPath;
                let uploadPath;
                let pathPrefix = params.pathPrefix;
                if (Object.keys(req.files).length == 0) {
                    res.status(400);
                    resp.result = { error: 'no file was uploaded' };
                    return res.json(resp);
                }
                let sampleFile = req.files.sampleFile;
                uploadPath = mountPath + '/' + pathPrefix + '/' + sampleFile.name;
                fs.rename(sampleFile.path, uploadPath, err => {
                    if (err)
                        throw err;
                    resp.result = { data: 'File uploaded!' };
                    res.json(resp);
                });
            }
            else {
                resp.errorLevel = -1;
                resp.errorMessage = 'mismatch';
                res.json(resp);
            }
        });
    }
}
