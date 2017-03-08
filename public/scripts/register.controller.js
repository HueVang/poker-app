angular.module('pokerApp').controller('RegisterController', function($http, $location){
  var ctrl = this;

  console.log('RegisterController loaded');

  ctrl.register = function() {
    console.log('creating a new user');

    $http.post('/register', {
      username: ctrl.username,
      password: ctrl.password,
      first_name: ctrl.first_name,
      last_name: ctrl.last_name,
      email: ctrl.email,
      linkedin: ctrl.linkedin,
      bio: ctrl.bio,
      photourl: null
    }).then(function(response){
      console.log(response);
      $location.path('/home');
    }, function(error) {
      console.log('error registering new user', error);
    });
  };
});
