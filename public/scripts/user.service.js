angular.module('pokerApp').service('UserService', function($http, $location) {
  var ctrl = this;
  var viewPlayer;
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
  // ctrl.savePlayerRoster= function(playerRoster){
  //   return $http.post('/users/users', playerRoster).then(function(response){
  //     return response;
  //   });
  // };
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
      return res;
    });
  };

  ctrl.savePlayerProfile = function(playerId){
    viewPlayer = playerId;
    console.log('viewPlayer:', viewPlayer);
    $location.path('other.profile');
  };

  ctrl.getPlayerToShow = function(){
    return $http.get('/users/playerToShow/'+ viewPlayer).then(function(res){
      return res;
    });
  };

  ctrl.getEditProfile = function(){
    console.log("in getEditProfile");
    return $http.get('/users/editPlayerProfile/'+ viewPlayer).then(function(res){
      return res;
    });
  };


  ctrl.addUserToGame = function(username) {
    return $http.post('/users/user/addToGame/'+username).then(function(res) {
      return res;
    })
  }; // end ctrl.getUser

  ctrl.revertRegularStatus = function(username) {
    return $http.post('/users/user/revertStatus/'+username).then(function(res) {
      return res;
    })
  }; // end ctrl.revertRegularStatus

});
