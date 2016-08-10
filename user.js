var mongoose = require('mongoose');

var User = mongoose.model('User', {
  email: {type: String},
  logins: {type: String}
});

module.exports = User;
