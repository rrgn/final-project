var app = angular.module('app', []);

//master password controller
app.controller('MainController', function($scope, open, sendData) {
  $scope.unlock = function() {
    var loginData = {
      email: $scope.email,
      mPassword: $scope.password
    };
    // var pword = $scope.password;
    open.openSesame(loginData, function(data) {
      $scope.data = data;
    });
  };
  $scope.saveInfo = function() {
    var userData = {
      email: $scope.email,
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


app.factory('open', function($http) {
  return {
    openSesame: function(loginData, callback) {
      // console.log(password);
      var pass = {
        email: loginData.email,
        pass: loginData.mPassword
      };
      console.log(pass);
      $http.post('/info', pass)
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
