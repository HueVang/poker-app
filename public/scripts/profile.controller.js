angular.module('pokerApp').controller('ProfileController', function($http, UserService, $location) {
  console.log('ProfileController loaded');

  var ctrl = this;



ctrl.showEditProfile = function() {
  UserService.getPlayerToShow().then(function(res){


    ctrl.id = res.data[0].id;
    ctrl.username = res.data[0].username;
    ctrl.email = res.data[0].email;
    ctrl.first_name = res.data[0].first_name;
    ctrl.last_name = res.data[0].last_name;
    ctrl.linkedin = res.data[0].linkedin;
    ctrl.bio = res.data[0].bio;
    ctrl.password = res.data[0].password;
    // ctrl.photourl = res.data[0].photourl;
  console.log('loaded the user clicked on:',ctrl.first_name);

  });
  };
  ctrl.showEditProfile();

  if (document.getElementById("profilePicture") !== null) {
    document.getElementById("profilePicture").onchange = function() { document.getElementById("upload").submit(); };
  // }
// if (document.getElementById("profilePicture") !== null) {
//   document.getElementById("profilePicture").onchange = function(){
//     submitForm();
//   };
//   function submitForm(){
//         document.getElementById("upload").submit();
//
//     }
//


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
  return $http.put('/users/'+playerInfo.id, playerInfo).then(function(response) {
    console.log('in put request of updateProfile');
    return response;
  }).catch(function(err) {
    console.log('error getting response: ', err);
    ctrl.getPlayerProfileInfo();
  });
};

ctrl.cancelProfileChanges = function() {
    $location.path('/home');
  };

// ctrl.register = function() {
//   console.log('creating a new user');
//
//   $http.post('/users', {
//     username: ctrl.username,
//     password: ctrl.password,
//     first_name: ctrl.first_name,
//     last_name: ctrl.last_name,
//     email: ctrl.email,
//     linkedin: ctrl.linkedin,
//     bio: ctrl.bio,
//     // photourl: null
//     photourl: ctrl.photourl
//   }).then(function(response){
//     console.log(response);
//     $location.path('/home');
//   }, function(error) {
//     console.log('error registering new user', error);
//   });
// };
// });

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
}
}); // end ProfileController
