var app = angular.module('app', []);

//master password controller
app.controller('MainController', function($scope, open, sendData, $http, $timeout, $window, $location, $anchorScroll) {
  $location.hash('');
  $scope.unlock = function() {
    var loginData = {
      email: $scope.email,
      mPassword: $scope.password
    };
    open.openSesame(loginData).success(function(data) {
      $scope.data = data;
      // console.log(data);
      if (data === 'no data to show') {
        $scope.showTable = false;
      } else {
        $scope.showTable = true;
        $location.hash('middle');
        $anchorScroll();
      }
    }).error(function(error) {
      $scope.message = error.message;
      $scope.showErrorKey = true;
      // console.log('error', $scope.message);
      $timeout(function() {
        $scope.showErrorKey = false;
      }, 2500);
      $scope.showTable = false;
    });
  };

  $scope.create = function() {
    var createData = {
      email: $scope.email,
      mPassword: $scope.password
    };
    // console.log(createData);
    $http.post('/create', createData).success(function(data) {
      // console.log(data);
      $scope.showForm = true;
      $location.hash('bottom');
      anchorScroll();
    }).error(function(error) {
      // console.log('this is error', error);
      $scope.error = error;
      var status = error.status;
      if(status === 'fail') {
        $scope.showForm = false;
        $scope.showError = true;
        $timeout(function() {
          $scope.showError = false;
        }, 2500);
      }
    });
  };

  $scope.hideForm = function() {
    $scope.showForm = false;
    $location.hash('middle');
    anchorScroll();
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
    $location.hash('middle');
    $anchorScroll();
    
    sendData.userInfo(userData).success(function() {
      $scope.unlock();
    });
    console.log('clicked the save button', userData);
    $scope.showForm = false;

  };

  $scope.toggleAddAccount = function() {
    $scope.showForm = true;
    $scope.website = '';
    $scope.username = '';
    $scope.acctPassword = '';
    $location.hash('bottom');
    $anchorScroll();
  };

  $scope.reload = function() {
    $window.location.reload();
  };
});



app.factory('open', function($http) {
  return {
    openSesame: function(loginData) {
      // console.log(password);
      var pass = {
        email: loginData.email,
        pass: loginData.mPassword
      };
      console.log(pass);
      return $http.post('/info', pass);
      // .success(function(data) {
      //   callback(data);
      // });
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
