var mongoose = require('mongoose');

var User = require('./user');

mongoose.connect('mongodb://localhost/FlatPass');

var firstUser = new User({
  masterPassword: 'alskdjfh',
  logins: [{
    website: 'nebula.org',
    siteUsername: 'nanodog',
    password: 'qpwoeiru'
  }]
});

firstUser.save(function(err) {
  if(err) {
    console.log(err.message);
    return;
  }
  console.log('user saved.', firstUser);
  process.exit();
});
