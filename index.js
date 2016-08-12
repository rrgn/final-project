var express = require('express');
var mongoose = require('mongoose');
const crypto = require('crypto');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var User = require('./user');
// var encPass;

mongoose.connect('mongodb://localhost/FlatPass');

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

  res.send('ok');
});

// encrypt data and save to DB
app.post('/data', function(request, res) {
  var allData = request.body;
  var email = request.body.email;
  var key = request.body.mPassword;
  var info = request.body.data;
  console.log('all the data:', allData);
  console.log('key: ', key);
  console.log('email: ', email);
  console.log(info);
  var stringInfo = JSON.stringify(info);
  const cipher = crypto.createCipher('aes192', key);
  var encryptedData = cipher.update(stringInfo, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  console.log('info sent: ', stringInfo, encryptedData);
  var data = new User({
    email: email,
    logins: encryptedData
  });
  data.save(function(err) {
    if(err) {
      console.log('error in save: ', err);
      return;
    }
  });
  res.send('ok');
});

//retrieve user data
app.post('/info', function(request, res) {
  var info = request.body;
  console.log('this is info:', info);
  var key = request.body.pass;
  var email = request.body.email;
  console.log('this is the key:', key);
  User.findOne( { email: email }, function(err, user) {
    if(!user) {
      // res.json({status: 'fail', message: 'Invalid Email'});
      console.log('Invalid email address');
      return;
    } else {
      console.log('a match was found', user);
      var data = user.logins;
      console.log('this is data: ', data, typeof(data));
      const decipher = crypto.createDecipher('aes192', key);
      var decrypted = decipher.update(data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      console.log(decrypted);
    }
  });
  res.json({status: 'ok'});
});

app.listen(3030, function() {
  console.log('listening on PORT 3030');
});
