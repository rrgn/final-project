var express = require('express');
var mongoose = require('mongoose');
const crypto = require('crypto');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var User = require('./user');
// var encPass;

mongoose.connect('mongodb://localhost/FlatPass');

// function catchpass(pass) {
//   encPass = pass;
//   console.log('inside catchpass: ', encPass);
//   return encPass;
// }

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));

// catch password
app.post('/password', function(request, res) {
  console.log('this is request.body', request.body);
  var mPass = request.body.pass;
  // console.log(mPass);
  // var mPassString = JSON.stringify(mPass);
  // const cipher = crypto.createCipher('aes192', mPassString);
  // var encrypted = cipher.update('the bird is the word','utf8', 'hex');
  // encrypted += cipher.final('hex');
  // console.log('encrypted: ', encrypted);
  // catchpass(mPass);
  // var user = new User({
  //   nameNpass: encrypted
  // });
  // user.save(function(err) {
  //   if (err) {
  //     console.log('error in save: ', err.message);
  //     return;
  //   }
  // });
  res.send('ok');
});

// catch data
app.post('/data', function(request, res) {
  var info = request.body;
  console.log(info);
  var stringInfo = JSON.stringify(info);
  // const cipher = crypto.createCipher('aes192', encPass);
  // var encryptedData = cipher.update(stringInfo, 'utf8', 'hex');
  // console.log('encrypted info sent: ', stringInfo, encryptedData);
  // var data = new User({
  //   logins: encryptedData
  // });
  // data.save(function(err) {
  //   if(err) {
  //     console.log('error in save: ', err);
  //     return;
  //   }
    res.send('ok');
  // });
});

//retrieve user data
app.post('/info', function(request, res) {
  var key = request.body;
  console.log('this is the key:', key);
  User.find(function(err, users) {
    if(err) {
      console.log(err.message);
      return;
    }
    var userInfo = users[0].logins;
    console.log('Users: ', userInfo);
    // console.log('key: ', typeof(key));
    // const decipher = crypto.createDecipher('aes192', encPass);
    // var decrypted = decipher.update(info, 'hex', 'utf8');
    // decrypted += decipher.final('utf8');
    // console.log(decrypted);
  });
  res.json({status: 'ok'});
});

app.listen(3030, function() {
  console.log('listening on PORT 3030');
});
