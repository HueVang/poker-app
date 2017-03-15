angular.module('pokerApp').controller('ProfileController', function($http, UserService, $location) {
  console.log('ProfileController loaded');

  var ctrl = this;

  // ctrl.user = {
  // username: ctrl.username;
  // email: ctrl.email;
  // first_name: ctrl.first_name;
  // last_name: ctrl.last_name;
  // linkedin: ctrl.linkedin;
  // bio: ctrl.bio;
  //  ctrl.userid = user.id;
  // }
//   {"username" : "",
//   "password" : "",
//   "email" : "",
//   "first_name" : "",
//   "last_name" : "",
//   "linkedin" : "",
//   "bio" : ""
// }];

ctrl.showEditProfile = function() {
  UserService.getPlayerToShow().then(function(res){
    // var user = res.data[0];
    //
    //    console.log('user', user);
    // console.log('loaded the user clicked on:',user);
    //
    // ctrl.username = user.username;
    // ctrl.email = user.email;
    // ctrl.first_name = user.first_name;
    // ctrl.last_name = user.last_name;
    // ctrl.linkedin = user.linkedin;
    // ctrl.bio = user.bio;
    // ctrl.userid = user.id;

  });
  };
  ctrl.showEditProfile();

  // console.log('Profile Info Object: ', ctrl.profile_info);

  if (document.getElementById("profilePicture") !== null) {
    document.getElementById("profilePicture").onchange = function() { document.getElementById("upload").submit(); };
  }

  ctrl.getProfiles = function() {
     $http.get('/users/players').then(function(response) {
      ctrl.profiles = response.data;
      console.log('This is the profile data: ',response.data);
    }).catch(function(err) {
      console.log('error getting response from the profile :', err);
    });
  }; // end getProfiles function

  ctrl.getProfiles();

  ctrl.getPlayerProfileInfo = function() {
    $http.get('/users/playerinfo').then(function(response) {
      ctrl.player_info = response.data;
      console.log('This is the info of the logged in player: ', response.data);
    }).catch(function(err) {
      console.log('error getting response from the player :', err);
    });
  }; // end getPlayerProfileInfo function

  ctrl.getPlayerProfileInfo();
//changing to
ctrl.getLinkedIn = function() {
  if (ctrl.linkedin == null) {
    console.log('No linkedin link');
    $location.path('/edit.profile');
  } else {
    window.location.href = (ctrl.linkedin);
  }
};
  // ctrl.linkedin = function() {
  //   if (ctrl.profile_info[0].linkedin == null) {
  //     console.log('No linkedin link');
  //     $location.path('/edit.profile');
  //   } else {
  //     window.location.href = (ctrl.profile_info[0].linkedin);
  //   }
  // }; // end linkedin function

  ctrl.profilePage = function() {
    $location.path('/edit.profile');
  }; //end profilePage function

  ctrl.edit = function() {
    $location.path('/edit.profile');
  }; //end edit function

  ctrl.saveProfileChanges = function(playerInfo) {
    console.log('This is the player\'s info: ', playerInfo);
    return $http.post('/users/image', playerInfo).then(function(response) {
      $location.path('/edit.profile');
      return response;
    }).catch(function(err) {
      console.log('error getting response: ', err);
      ctrl.getPlayerProfileInfo();
    });
  }; // end saveProfileChanges function
//adding
ctrl.updateProfile = function(playerInfo) {
  console.log('This is the player\'s info: ', playerInfo);
  return $http.put('/users/'+playerInfo, playerInfo).then(function(response) {
    // $location.path('/edit.profile');
    console.log('in put request of updateProfile');
    return response;
  }).catch(function(err) {
    console.log('error getting response: ', err);
    ctrl.getPlayerProfileInfo();
  });
};
//
//   ctrl.logout = function() {
//     $http.delete('/login').then(function(){
//       console.log('Successfully logged out!');
//       $location.path('/');
//     }).catch(function(err){
//       console.log('Error logging out');
//     });
//   };
//   //adding from other profile
//   ctrl.showPlayerProfile = function() {
//     UserService.getPlayerToShow().then(function(res){
//       var user = res.data[0];
//       console.log(user);
//       ctrl.username = user.username;
//       ctrl.first_name = user.first_name;
//       ctrl.last_name = user.last_name;
//       ctrl.linkedin = user.linkedin;
//       ctrl.bio = user.bio;
//     });
//     };
//     ctrl.showPlayerProfile();
//
//   ctrl.getPlayerInfo = function() {
//
//     $http.get('/users/playerinfo').then(function(response) {
//       ctrl.player_info = response.data;
//       console.log('This is the player info: ', response.data);
//     }).catch(function(err) {
//       console.log('error getting response from the user :', err);
//     });
//   }; // end getPlayerInfo function
//
//   ctrl.getPlayerInfo();
//
//
//   ctrl.getLinkedIn = function(link) {
//     if (link == null) {
//       console.log('No linkedin link');
//     } else {
//       window.location.href = (link);
//     }
//   }; // end linkedin function
//
//
//   ctrl.getPlayers = function() {
//      $http.get('/users/players').then(function(response) {
//       ctrl.players = response.data;
//       console.log('This is the players data: ',response.data);
//     }).catch(function(err) {
//       console.log('error getting response from the players :', err);
//     });
//   }; // end getPlayers function
//
//   ctrl.getPlayers();
//
//
//   ctrl.profileView = function() {
//     $location.path('/other.profile');
//   };

  // ctrl.logout = function() {
  //   $http.delete('/login').then(function(){
  //     console.log('Successfully logged out!');
  //     $location.path('/');
  //   }).catch(function(err){
  //     console.log('Error logging out');
  //   });
  // };

}); // end ProfileController
