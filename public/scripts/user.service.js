angular.module('pokerApp').service('UserService', function($http, $location) {
  var ctrl = this;

  ctrl.getRegulars = function() {
    return $http.get('/users/regulars').then(function(res) {
      console.log('This is user.service.js res: ', res);
      return res;
    })
  }; // end ctrl.getUsersNames

  ctrl.getUsers = function() {
    return $http.get('/users/allusers').then(function(res) {
      return res;
    })
  }; // end ctrl.getUsers

  ctrl.log = function() {
    console.log('This is the user service console log');
  }; // end ctrl.log

});
