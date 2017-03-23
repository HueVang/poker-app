angular.module('pokerApp').controller('ProfileController', function($http, UserService, $location) {
  console.log('ProfileController loaded');

  var ctrl = this;
  ctrl.checkAdminStatus = function() {
    UserService.getCurrentUser().then(function(res) {
      console.log('this is the res.data, ', res.data);
      var thisUser = res.data.user;
      if(thisUser.admin == true){
        ctrl.admin = true;
      }else{
        ctrl.admin = false;
      }
      if(ctrl.id == thisUser.id || thisUser.admin == true){
        ctrl.thisPlayer = true;
        console.log('this player is, ', ctrl.thisPlayer);
      }else{
        console.log('this ctrl.id is, ', ctrl.id);
        console.log('this player is, ', thisUser.id);
        console.log('this adminstatus is, ', thisUser.admin);
        ctrl.thisPlayer = false;
      }
    });
  };

ctrl.showEditProfile = function() {
  UserService.getPlayerToShow().then(function(res){
    var user = res.data[0];

    ctrl.id = user.id;
    ctrl.username = user.username;
    ctrl.email = user.email;
    ctrl.first_name = user.first_name;
    ctrl.last_name = user.last_name;
    ctrl.linkedin = user.linkedin;
    ctrl.bio = user.bio;
    ctrl.administrator = user.admin;
    ctrl.regular = user.regular;
    ctrl.emailcred = user.emailcred;
  console.log('loaded the user clicked on:',ctrl.first_name);
    ctrl.checkAdminStatus();
  });
  };
  ctrl.showEditProfile();


  if (document.getElementById("profilePicture") !== null) {
    document.getElementById("profilePicture").onchange = function() { document.getElementById("upload").submit(); };

  ctrl.getPlayerProfileInfo = function() {
    $http.get('/users/playerinfo').then(function(response) {
      ctrl.player_info = response.data;
      console.log('This is the info of the logged in player: ', response.data);
    }).catch(function(err) {
      console.log('error getting response from the player :', err);
    });
  }; // end getPlayerProfileInfo function

  ctrl.getPlayerProfileInfo();


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

ctrl.updateProfile = function() {
  playerInfo = {};
  playerInfo.id = ctrl.id;
  playerInfo.username = ctrl.username;
  playerInfo.first_name = ctrl.first_name;
  playerInfo.last_name = ctrl.last_name;
  playerInfo.admin = ctrl.administrator;
  playerInfo.regular = ctrl.regular;
  console.log('this is admin status', playerInfo.admin);
  console.log('this is regular status', playerInfo.regular);
  playerInfo.bio = ctrl.bio;
  playerInfo.linkedin = ctrl.linkedin;
  playerInfo.email = ctrl.email;
  playerInfo.emailcred = ctrl.emailcred;
  console.log('This is the player info: ', playerInfo);
  return $http.put('/users/'+playerInfo.id, playerInfo).then(function(response) {
    console.log('in put request of updateProfile');
    $location.path('/playerRoster');
    alertify.success('Profile edited');
  }).catch(function(err) {
    console.log('error getting response: ', err);
    ctrl.getPlayerProfileInfo();
  });
};


  ctrl.cancelEdit = function(){
    $location.path('/playerRoster')
    alertify.error('Profile not edited');
  }

  ctrl.clicked = function(){
    console.log('You clicked Sign Out!');
  }

  ctrl.logout = function(){
    $http.delete('/login').then(function(){
      console.log('Successfully logged out!');
      alertify.warning('You are now signed out.');
      $location.path('/');
    }).catch(function(err){
      console.log('Error logging out');
    });
  };

  ctrl.profileView = function() {
    $location.path('/other.profile');
  };
  
}
}); // end ProfileController
