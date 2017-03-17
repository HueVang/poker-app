angular.module('pokerApp')
.controller('LoginController', LoginController);

function LoginController($http, $location) {
  console.log('LoginController loaded');
  var ctrl = this;

  ctrl.login = function() {
    console.log('logging in');
    $http.post('/login', {
      username: ctrl.username,
      password: ctrl.password
    }).then(function(response){
      console.log(response);
      $location.path('/home');
    }, function(error) {
      console.log('error logging in', error);
      alertify.error('There was an error signing in. The username and password combination you have entered is not correct.');
    });
  };
}
