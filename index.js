const express = require('express')
const Vision = require('@google-cloud/vision');
const app = express()

const projectId = 'winelist-165917';

const visionClient = Vision({
  projectId: projectId
});

const fileName = './list.jpg';

visionClient.detectText(fileName)
  .then((results) => {
    const detections = results[0];
    console.log('Text:');
    detections.forEach((text) => console.log(text));

  });




app.get('/', function (req,res){
  res.send('server running')
})

app.listen(3000, function() {
  console.log('serving running on 3000')
  })
