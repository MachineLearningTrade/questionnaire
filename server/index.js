const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
var answerHistories = {};
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(pino);

app.post('/api/savequestionnaire', function(req, res){
    var questionnairedata = req.body;
    fs.writeFileSync(questionnairedata.data.id+'.json', JSON.stringify(questionnairedata.data));
    res.status(200).send({
      'data': 'Upload result complete'
    })
});

app.get('/:filename', (req, res) => {
    var filePath = path.join(__dirname, '../'+req.params.filename);
    var data = JSON.parse(fs.readFileSync(filePath));
    res.json(data);
})

app.get('/api/:uid/:qno/:answer', (req,res) => {
    var qno = parseInt(req.params.qno);
    var answer = parseInt(req.params.answer);
    var uid = req.params.uid;
    //save user answer history in session object, can be leveraged to produce next question
    if (uid in answerHistories) {
      answerHistories[uid].push({qno:answer});
    } else {
      answerHistories[uid] = [{qno:answer}];
    }
    var nextq = -1;
    if (qno == 1) {
      switch(answer) {
        case 1:
          nextq = 2;
          break;
        case 2: 
          nextq = 3;
          break;
        case 3:
          nextq = 4;
          break;
        case 4:
          nextq = 5;
          break;
        default:
          nextq = 0;
          break;
      }
    } else if (qno >= 2 && qno <= 5) {
      nextq = 6;
    } else {
      nextq = qno + 1;
    }
    res.status(200).send({
      "data": nextq
    });
});

app.listen(3001, () =>
  console.log('Express server is running on localhost:3001')
);