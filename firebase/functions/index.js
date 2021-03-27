const functions = require("firebase-functions");
const cors = require("cors")({origin: true});
const vision = require('@google-cloud/vision');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//


exports.helloWorld = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    functions.logger.info("Hello logs!", {structuredData: true});
    response.send("Hello from Firebase!");
  });
});

exports.ocr = functions.https.onRequest((request, response) => {
  cors(request, response, () => {

    async function start(req) {
      const client = new vision.ImageAnnotatorClient();
      // Bucket where the file resides
      const bucketName = 'define-me-308905.appspot.com';
      // Path to PDF file within bucket
      const fileName = req.body.file;
      // The folder to store the results
      const outputPrefix = 'results'
      const gcsSourceUri = `gs://${bucketName}/${fileName}`;
      const gcsDestinationUri = `gs://${bucketName}/${outputPrefix}/`;

      const inputConfig = {
        // Supported mime_types are: 'application/pdf' and 'image/tiff'
        mimeType: 'application/pdf',
        gcsSource: {
          uri: gcsSourceUri,
        },
      };
      const outputConfig = {
        gcsDestination: {
          uri: gcsDestinationUri,
        },
      };
      const features = [{type: 'DOCUMENT_TEXT_DETECTION'}];
      const request = {
      requests: [
          {
            inputConfig: inputConfig,
            features: features,
            outputConfig: outputConfig,
          },
        ],
      };

      const [operation] = await client.asyncBatchAnnotateFiles(request);
      // console.log(operation);
      const [filesResponse] = await operation.promise();
      // console.log(filesResponse.responses[0]);
      const destinationUri = filesResponse.responses[0].outputConfig.gcsDestination.uri;
      console.log('Json saved to: ' + destinationUri);
    }

    start(request);

    functions.logger.info("Making vision request!", {structuredData: true});
    response.send("Made request to vision!");
  });
});

exports.getData= functions.https.onRequest((request, response) => {
  cors(request, response, () => {

    const admin = require('firebase-admin');
    admin.storage().bucket().file("yourDirForFile/yourFile.json")
    .download(function (err, contents) {
        if (!err) {
            var jsObject = JSON.parse(contents.toString('utf8'))
        }
    }); 

    functions.logger.info("Getting data from ocr", {structuredData: true});
    response.send("Getting data");
  });
});