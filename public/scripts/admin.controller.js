angular.module('pokerApp').controller('AdminController', function($http, $location){
  var ctrl = this;

  console.log('AdminController loaded');

  ctrl.newGame = function() {
    $location.path('newGame');
  }; // end ctrl.newGame


});
