var express = require('express');
// var crypto = require('crypto');
var app = express();
var bodyParser = require('body-parser');

// const crypto = require('crypto');
// const cipher = crypto.createCipher('aes192', mPass);

app.use(express.static('public'));
app.use(bodyParser.json());
// var cert1 = new crypto.Certificate();
// console.log(cert1);

// catch password
app.post('/password', function(request, res) {
  var mPass = request.body.pass;
  console.log('backend post:', mPass);
  res.send('ok');
});

// catch data
app.post('/data', function(request, res) {
  var info = request.body;
  var stringInfo = JSON.stringify(info);
  console.log('info sent: ', info, stringInfo);
  res.send('ok');
});

app.listen(3030, function() {
  console.log('listening on PORT 3030');
});
