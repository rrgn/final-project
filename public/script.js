var app = angular.module('app', []);

//master password controller
app.controller('MainController', function($scope, open, sendData, $http) {
  $scope.unlock = function() {
    var loginData = {
      email: $scope.email,
      mPassword: $scope.password
    };
    open.openSesame(loginData, function(data) {
      $scope.data = data;
      console.log(data);
    });
    // $scope.showForm = true;
    $scope.showTable = true;
  };

  $scope.create = function() {
    var createData = {
      email: $scope.email,
      mPassword: $scope.password
    };
    console.log(createData);
    $http.post('/create', createData).then(function(data) {
      console.log(data);
    });
    $scope.showForm = true;
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
    $scope.showForm = false;
  };

  $scope.toggleAddAccount = function() {
    $scope.showForm = true;
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
