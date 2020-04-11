const File = require('../models/File');
const AWS = require('aws-sdk');
const fs = require('fs');
const uuid = require("uuid");

module.exports = {
  all: async function(req, res) {
    try{
      const files = await File.find({userId: req.user._id});
      res.json({data: files.map(file => file.toJSON())});
    } catch (err) {
      res.status(400);
      res.json({message: 'Failed to fetch tasks: ' + err.message});
    }
  },
  create: async function(req, res) {
    console.log(req.files);
    try {
      let files = [];
      if(!req.files) {
        res.send({
          status: false,
          message: 'No file uploaded'
        });
      } else {

        photos = req.files.photos
        if (!Array.isArray(photos)) {
          photos = [req.files.photos]
        }

        const s3 = new AWS.S3({
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        });


        //loop all files
        photos.forEach(async (photo) => {
          if (photo.size == 0) {
            return res.status(400).json({
              message: 'File not correct'
            });
          }

          const fileContent = fs.readFileSync(photo.tempFilePath);
          console.log(fileContent);

          let fileId = uuid.v4();
          let filename = `tasks/photos/${fileId}.jpg`;

          console.log(filename);

          //move photo to uploads directory
          // photo.mv('./uploads/' + photo.name);

          // Setting up S3 upload parameters
          const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: filename, // File name you want to save as in S3
            Body: fileContent,
            ACL: 'public-read'
          };

          const options = {
            partSize: 10 * 1024 * 1024,
            queueSize: 1
          };

          console.log(params);
          console.log(files);

          // Uploading files to the bucket
          await s3.upload(params, options, async function(s3Err, data) {
            if (s3Err) {
              console.log(s3Err);
              return res.status(400).json({
                message: s3Err
              });
            }
            else if (data) {
              console.log(`File uploaded successfully. ${data.Location}`);
              // save file details
              const file = new File({name: filename, url: data.Location});
              file.userId = req.user._id;
              await file.save();
              files.push(file);
              console.log(files);

            }
            else {
              console.log("Error saving your photo. Please try again.");
              return res.status(400).json({
                message: "Error saving your photo. Please try again."
              });
            }
          });
        });
      }

      console.log(files);

      res.json({
        message: 'Files has been uploaded successfully'
      });
    } catch (err) {
      res.status(400);
      res.json({message: 'Failed to create file: ' + err.message});
    }
  }
};
