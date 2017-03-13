angular.module('pokerApp').service('UserService', function($http, $location) {
  var ctrl = this;

  ctrl.getRegulars = function() {
    return $http.get('/users/regulars').then(function(res) {
      console.log('This is user.service.js res: ', res);
      return res;
    })
  }; // end ctrl.getUsersNames

  ctrl.getAllUsers = function() {
    return $http.get('/users/allusers').then(function(res) {
      return res;
    });
  }; // end ctrl.getAllUsers

  ctrl.getUsers = function() {
    return $http.get('/users/users').then(function(res) {
      return res;
    })
  }; // end ctrl.getUsers

//added
  ctrl.getPlayerRoster = function(){
    return $http.get('/users/users').then(function(response){
      return response.data;
    });
  };
  ctrl.savePlayerRoster= function(playerRoster){
return $http.post('/users/users', playerRoster).then(function(response){
  return response;
});
  };
  ctrl.log = function() {
    console.log('This is the user service console log');
  }; // end ctrl.log

  ctrl.checkAdminStatus = function(){
      return $http.get('/users/adminstatus').then(function(res){
        return res;
      });
    };

  ctrl.getCurrentUser = function(){
    return $http.get('/users/currentUser').then(function(res){
      return res
    });
  }

});
