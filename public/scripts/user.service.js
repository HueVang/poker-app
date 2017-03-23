angular.module('pokerApp').service('UserService', function($http, $location) {
  var ctrl = this;
  var viewPlayer;

  ctrl.getRegulars = function() {
    return $http.get('/users/regulars').then(function(res) {
      console.log('This is user.service.js res: ', res);
      return res;
    })
  }; // end ctrl.getRegulars

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

  ctrl.getPlayerRoster = function(){
    return $http.get('/users/users').then(function(response){
      return response.data;
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
      return res;
    });
  };

  ctrl.savePlayerProfile = function(playerId){
    viewPlayer = playerId;
    console.log('viewPlayer:', viewPlayer);
    $location.path('other.profile');
  };

  ctrl.saveEditProfile = function(playerId){
    viewPlayer = playerId;
    console.log('viewPlayer:', viewPlayer);
    $location.path('edit.profile');
  };

  ctrl.getPlayerToShow = function(){
    console.log('in getPlayerToShow this is viewPlayer', viewPlayer);
    return $http.get('/users/playerToShow/'+ viewPlayer).then(function(res){
      return res;
    });
  };

  ctrl.addUserToGame = function(username) {
    return $http.post('/users/user/addToGame/'+username).then(function(res) {
      return res;
    });
  }; // end ctrl.addUserToGame

  ctrl.getUserByUsername = function(username) {
    return $http.get('/users/user/getUserByUsername/'+username).then(function(res){
      return res;
    });
  }; // end ctrl.getUserByUsername

  ctrl.revertRegularStatus = function(username) {
    return $http.post('/users/user/revertStatus/'+username).then(function(res) {
      return res;
    });
}; // end ctrl.revertRegularStatus

  ctrl.updateProfile = function(changeProfile){
    return $http.put('/users/'+changeProfile.id, changeProfile ).then(function(res){
    console.log('res in updateProfile', res);
    return res;
    });
  };

  ctrl.getNewPlayer = function(hashId) {
    return $http.get('/users/newPlayer/'+ hashId).then(function(res){
      return res.data;
    });
  }

  ctrl.saveNewPlayer = function(player) {
    var data = player;
    var id = player.id;
    return $http.put('/users/'+ id, data).then(function(res){
      return res.data;
    });
  }

});
