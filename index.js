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

// // catch password
// app.post('/password', function(request, res) {
//   console.log('this is request.body', request.body);
//
//   res.send('ok');
// });

// encrypt data and save to DB via save button
app.post('/data', function(request, res) {
  var allData = request.body;
  var email = request.body.email;
  var key = request.body.mPassword;
  var info = request.body.data;
  console.log('all the data:', allData);
  console.log('key: ', key);
  console.log('email: ', email);
  console.log(info);
  User.findOne( {email: email}, function(err, user) {
    if (user) {
      console.log('found user');
      var data = user.logins;
      console.log('this is data: ', data, typeof(data));
      const decipher = crypto.createDecipher('aes192', key);
      var decrypted = decipher.update(data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      console.log(decrypted);
      var unstring = JSON.parse(decrypted);
      console.log(unstring);
      var arrLogins = [];
      arrLogins.push(unstring, info);
      console.log(arrLogins);
      var arrLoginsString = JSON.stringify(arrLogins);
      console.log(arrLoginsString);
      const cipher = crypto.createCipher('aes192', key);
      var encryptedData = cipher.update(arrLoginsString, 'utf8', 'hex');
      encryptedData += cipher.final('hex');
      console.log('info sent: ', arrLoginsString, encryptedData);
      // User.update(
      //   { email: email },
      //   {$set: { logins: encryptedData} },
      //   function(err, msg) {
      //     if (err) {
      //       console.error(err.message);
      //       return;
      //     }
      //     console.log('update successful', msg);
      //   });

      // code below this is for save new user - DONT DELETE!

      // var data = new User({
      //   email: email,
      //   logins: encryptedData
      // });
      // data.save(function(err) {
      //   if(err) {
      //     console.log('error in save: ', err);
      //     return;
      //   }
      // });
    }
  });


  res.send('ok');
});

//retrieve user data via unlock button
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
      console.log('about to decrypt', data);
      const decipher = crypto.createDecipher('aes192', key);
      var decrypted = decipher.update(data, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      console.log('the decrypted data', decrypted);
      res.send(decrypted);
    }
  });

});

app.listen(3030, function() {
  console.log('listening on PORT 3030');
});
