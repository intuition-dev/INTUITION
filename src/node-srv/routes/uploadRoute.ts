
export class UploadRoute {

    iauth

    upload(req, resp) {

      let uploadPath;

      if (Object.keys(req.files).length == 0) {
         return resp.status(400).send('No files were uploaded.');
      }
   
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let sampleFile = req.files.sampleFile;
      uploadPath = 'tmp/' + sampleFile.name;
   
      // Use the mv() method to place the file somewhere on your server
      sampleFile.mv(uploadPath, function (err) {
         if (err)
            return resp.status(500).send(err);
   
         resp.send('File uploaded!');
      })

 }
    
}//class