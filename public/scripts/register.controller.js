angular.module('pokerApp').controller('RegisterController', function($http, $route, $location, UserService){
  var ctrl = this;

  console.log('RegisterController loaded');
  console.log('this is the location.path ', $location.search());
  ctrl.hashId = $route.current.params.hashId;
  console.log('this is the hashId', ctrl.hashId);

  ctrl.getPlayerToShow = function(){
    UserService.getNewPlayer(ctrl.hashId).then(function(res){
      console.log(res);
      var newPlayer = res[0];
      ctrl.email = newPlayer.email;
      ctrl.id = newPlayer.id;
    });
  }

  ctrl.getPlayerToShow();

  ctrl.register = function(){
    var player = {};
    player.email = ctrl.email;
    player.id = ctrl.id
    player.username = ctrl.username;
    player.password = ctrl.password;
    player.first_name = ctrl.first_name;
    player.last_name = ctrl.last_name;
    player.linkedin = ctrl.linkedin;
    player.bio = ctrl.bio;
    player.admin = false;
    player.regular = false;
    UserService.saveNewPlayer(player).then(function(res){
      console.log(res);
    });
  }

  // ctrl.register = function() {
  //   console.log('creating a new user');
  //   $http.post('/register', {
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
});
