var express = require('express');
var mongoose = require('mongoose');
const crypto = require('crypto');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var User = require('./user');

mongoose.connect('mongodb://localhost/FlatPass');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));

//retrieve user data via unlock button
app.post('/info', function(request, res) {
  var info = request.body;
  // console.log('this is info:', info);
  var key = request.body.pass;
  var email = request.body.email;
  // console.log('this is the key:', key);
  User.findOne( { email: email }, function(err, user) {
    if(!user) {
      // console.log('Email not found');
      res.status(404).json({status: 'fail', message: 'Email not found'});
      return;
    } else {
      // console.log('a match was found', user);
      var data = user.logins;
      // console.log('this is data: ', data, typeof(data));
      // res.send('ok');
      if (data !== 'none') {
        // console.log('about to decrypt', data);
        try {
          // console.log('this is crypto decipher: ', crypto.createDecipher('aes192', key));
          // throw crypto.createDecipher('aes192', key);
          const decipher = crypto.createDecipher('aes192', key);
          // console.log('_handle ', decipher._handle);
          var decrypted = decipher.update(data, 'hex', 'utf8');
          // console.log('this is decrypted: ', decrypted);
          decrypted += decipher.final('utf8');
          // console.log('the decrypted data in /info', decrypted);
          res.send(decrypted);
        } catch(error) {
          res.status(403).json( { status: 'fail', message: 'incorrect email or password', error: error});
        }
      } else {
        res.send('no data to show');
      }
    }
  });
});

// encrypt data and save to DB via save button
app.post('/data', function(request, res) {
  var allData = request.body;
  var email = request.body.email;
  var key = request.body.mPassword;
  var info = request.body.data;
  // console.log('all the data:', allData);
  // console.log('key: ', key);
  // console.log('email: ', email);
  // console.log(info);

  User.findOne( {email: email}, function(err, user) {
      var data = user.logins;
      // console.log('found user', 'this is the data inside /data:', data, typeof(data));
      if(data !== 'none') {
        //decrypt data
        const decipher = crypto.createDecipher('aes192', key);
        var decrypted = decipher.update(data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        // console.log('this is the decrypted data in /data: ', decrypted, typeof(decrypted));
        var reverseString = JSON.parse(decrypted);
        // console.log('this is reverseString: ', reverseString, 'type of reverseString: ', typeof(reverseString));
        reverseString.push(info);
        StringAgain = JSON.stringify(reverseString);
        // console.log('this is StringAgain: ', StringAgain);
        const cipher = crypto.createCipher('aes192', key);
        var encryptedData = cipher.update(StringAgain, 'utf8', 'hex');
        encryptedData += cipher.final('hex');
        // console.log('this is encryptedData inside of /info: ', encryptedData);
        User.update(
          { email: email },
          { $set: {logins: encryptedData} },
          function(err, msg) {
            if(err) {
              // console.log('error');
              res.json({ status: 'fail', message: 'error saving data'});
              return;
            } else {
              // console.log('save successful');
              res.json({ status: 'ok', message: 'save successful'});
            }
          }
        );
      } else {
        var stringInfo = JSON.stringify([info]);
        // console.log('this is the object in string format: ', stringInfo);
        const cipher = crypto.createCipher('aes192', key);
        var encryptedData = cipher.update(stringInfo, 'utf8', 'hex');
        encryptedData += cipher.final('hex');
        // console.log('this is object encrypted: ', encryptedData);
        User.update(
          { email: email },
          { $set: {logins: encryptedData} },
          function(err, msg) {
            if(err) {
              // console.log('error');
              res.json({ status: 'fail', message: 'error saving data'});
              return;
            } else {
              // console.log('save successful');
              res.json({ status: 'ok', message: 'save successful'});
            }
          }
        );
      }
  });
});

app.post('/create', function(request, res) {
  var info = request.body;
  var email = request.body.email;
  // console.log(info);
  User.findOne( { email: email}, function(err, person) {
    if (person) {
      // console.log('email address already exists');
      res.status(409).json({status: 'fail', message: 'email address already exists'});
      return;
    } else {
      var user = new User({
        email: email,
        logins: 'none'
      });
      // console.log('this is a user:', user);
      user.save(function(err) {
        if(err) {
          // console.log('error in save: ', err);
          res.status(501).json({status: 'fail', message: 'error in save'});
          return;
        } else {
          // console.log('saved');
          res.send('ok');
        }
      });
    }
  });
});

app.listen(3030, function() {
  console.log('listening on PORT 3030');
});
