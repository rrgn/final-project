var app = angular.module('app', []);

//master password controller
app.controller('MainController', function($scope, savePass, sendData) {
  $scope.login = function() {
    var pword = $scope.password;
    savePass.savePassword(pword, function(password) {
    });
  };
  $scope.saveInfo = function() {
    var userData = {
      website: $scope.website,
      username: $scope.username,
      acctPassword: $scope.acctPassword
    };
    sendData.userInfo(userData);
    console.log('clicked the save button', userData);
  };
});


app.factory('savePass', function($http) {
  return {
    savePassword: function(password, callback) {
      console.log(password);
      var pass = {pass: password};
      $http.post('/password', pass)
      .success(function(data) {
        callback(data);
      });
    }
  };
});

app.factory('sendData', function($http) {
  return {
    userInfo: function(info) {
      return $http.post('/data', info);
    }
  };
});
