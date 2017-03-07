angular.module('pokerApp').service('UserService', function($http, $location) {
  var ctrl = this;

  ctrl.getUsers = function() {
    return $http.get('/users/allusers').then(function(res) {
      return res;
    })
  }; // end ctrl.getUsers

  ctrl.log = function() {
    console.log('This is the user service console log');
  }; // end ctrl.log

});
