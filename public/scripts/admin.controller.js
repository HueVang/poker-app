angular.module('pokerApp').controller('AdminController', function($http, $location){
  var ctrl = this;

  console.log('AdminController loaded');

  ctrl.newGame = function() {
    $location.path('newGame');
  }; // end ctrl.newGame

  ctrl.logout = function() {
    $http.delete('/login').then(function(){
      console.log('Successfully logged out!');
      $location.path('/');
    }).catch(function(err){
      console.log('Error logging out');
    });
  };


});
