angular.module('pokerApp').controller('ProfileController', function($http, $location) {
  console.log('ProfileController loaded');

  var ctrl = this;
  ctrl.profile_info = [
  {"username" : "",
  "password" : "",
  "email" : "",
  "first_name" : "",
  "last_name" : "",
  "linkedin" : "",
  "bio" : ""
}];


  console.log('Profile Info Object: ', ctrl.profile_info);

  if (document.getElementById("profilePicture") !== null) {
    document.getElementById("profilePicture").onchange = function() { document.getElementById("upload").submit(); };
  }

  ctrl.getProfiles = function() {
     $http.get('/register/players').then(function(response) {
      ctrl.profiles = response.data;
      console.log('This is the profile data: ',response.data);
    }).catch(function(err) {
      console.log('error getting response from the profile :', err);
    });
  }; // end getProfiles function

  ctrl.getProfiles();

  ctrl.getPlayerProfileInfo = function() {
    $http.get('/register/playerinfo').then(function(response) {
      ctrl.player_info = response.data;
      console.log('This is the player info: ', response.data);
      console.log('This is ctrl.profile_info:', ctrl.profile_info);
    }).catch(function(err) {
      console.log('error getting response from the player :', err);
    });
  }; // end getPlayerProfileInfo function

  ctrl.getPlayerProfileInfo();

  ctrl.linkedin = function() {
    if (ctrl.profile_info[0].linkedin == null) {
      console.log('No linkedin link');
      $location.path('/edit.profile');
    } else {
      window.location.href = (ctrl.profile_info[0].linkedin);
    }
  }; // end linkedin function

  ctrl.profilePage = function() {
    $location.path('/edit.profile');
  }; //end profilePage function

  ctrl.edit = function() {
    $location.path('/edit.profile');
  }; //end edit function

  ctrl.saveProfileChanges = function(playerInfo) {
    console.log('This is the player\'s info: ', playerInfo);
    return $http.post('/register/image', playerInfo).then(function(response) {
      $location.path('/edit.profile');
      // return response;
    }).catch(function(err) {
      console.log('error getting response: ', err);
      ctrl.getPlayerProfileInfo();
    });
  }; // end saveProfileChanges function

  ctrl.logout = function() {
    $http.delete('/login').then(function(){
      console.log('Successfully logged out!');
      $location.path('/');
    }).catch(function(err){
      console.log('Error logging out');
    });
  };
}); // end ProfileController
