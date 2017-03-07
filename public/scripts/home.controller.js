angular.module('pokerApp').controller('HomeController', function($http, $location, $scope){

  var home = this;

  var socket = io.connect();

  this.logout = function() {
    $http.delete('/login').then(function(){
      console.log('Successfully logged out!');
      $location.path('/');
    }).catch(function(err){
      console.log('Error logging out');
    });
  };

    socket.on('broadcast', function(data){
      console.log(data.description);
      home.playerList = data.description;
      $scope.$apply();
    });

});
