angular.module('pokerApp').controller('ProfileController', function($http, UserService, $location) {
  console.log('ProfileController loaded');

  var ctrl = this;
  ctrl.showPlayerProfile = function() {
    UserService.getPlayerToShow().then(function(res){
      // var user = res.data[0];
      
      console.log(user);
      ctrl.username = user.username;
      ctrl.first_name = user.first_name;
      ctrl.last_name = user.last_name;
      ctrl.linkedin = user.linkedin;
      ctrl.bio = user.bio;
    });
    };
    ctrl.showPlayerProfile();

  ctrl.getPlayerInfo = function() {

    $http.get('/users/playerinfo').then(function(response) {
      ctrl.player_info = response.data;
      console.log('This is the player info: ', response.data);
    }).catch(function(err) {
      console.log('error getting response from the user :', err);
    });
  }; // end getPlayerInfo function

  ctrl.getPlayerInfo();


  ctrl.getLinkedIn = function(link) {
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
}); // end ProfileController
