//EDIT
angular.module('pokerApp').controller('PlayerProfileController', function($http, $location) {
  console.log('PlayerProfileController loaded');

  var ctrl = this;
  ctrl.otherProfile = [];
  ctrl.showPlayerProfile = function(id) {
    console.log('This is the user id: ', 'user_' + id);
    var profileId = document.getElementById(id);
    return $http.get('/users/' + profileId).then(function(res) {
    return res;
      });
    // }; //



  }; // end showPlayerProfile

//changed from register to users
  ctrl.getPlayerInfo = function() {

    $http.get('/users/playerinfo').then(function(response) {
      ctrl.player_info = response.data;
      console.log('This is the player info: ', response.data);
    }).catch(function(err) {
      console.log('error getting response from the user :', err);
    });
  }; // end getPlayerInfo function

  ctrl.getPlayerInfo();


  ctrl.linkedin = function(link) {
    if (link == null) {
      console.log('No linkedin link');
    } else {
      window.location.href = (link);
    }
  }; // end linkedin function


  ctrl.getPlayers = function() {
     $http.get('/users/players').then(function(response) {
      ctrl.players = response.data;
      console.log('This is the players data: ',response.data);
    }).catch(function(err) {
      console.log('error getting response from the players :', err);
    });
  }; // end getPlayers function

  ctrl.getPlayers();

  ctrl.getPlayers = function() {
     $http.get('/users/players').then(function(response) {
      ctrl.users = response.data;
      console.log('This is the players data: ',response.data);
    }).catch(function(err) {
      console.log('error getting response:', err);
    });
  }; // end getPlayers function

  ctrl.getPlayers();

  ctrl.profileView = function() {
    $location.path('/other.profile');
  };

  ctrl.logout = function() {
    $http.delete('/login').then(function(){
      console.log('Successfully logged out!');
      $location.path('/');
    }).catch(function(err){
      console.log('Error logging out');
    });
  };
}); // end PlayerProfileController
