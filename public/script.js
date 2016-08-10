var app = angular.module('app', []);

//master password controller
app.controller('MainController', function($scope, savePass, sendData) {
  $scope.login = function() {
    var loginData = {
      email: $scope.email,
      mPassword: $scope.password
    };
    // var pword = $scope.password;
    savePass.savePassword(loginData, function() {
    });
  };
  $scope.saveInfo = function() {
    var userData = {
      mPassword: $scope.password,
      data: {
        website: $scope.website,
        username: $scope.username,
        acctPassword: $scope.acctPassword
      }
    };
    sendData.userInfo(userData);
    console.log('clicked the save button', userData);
  };
});


app.factory('savePass', function($http) {
  return {
    savePassword: function(loginData, callback) {
      // console.log(password);
      var pass = {
        email: loginData.email,
        pass: loginData.mPassword
      };
      console.log(pass);
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
