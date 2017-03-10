angular.module('pokerApp').controller('HomeController', function(DigestService, $http, $location, $scope){

  var ctrl = this;

  var socket = io.connect();

  ctrl.getDigests = function() {
    DigestService.getDigests().then(function(res) {
      console.log('This is the digests: ', res.data);
      ctrl.digestList = res.data;
    });
  }; // end ctrl.getDigests

  ctrl.getDigests();

  ctrl.logout = function() {
    $http.delete('/login').then(function(){
      console.log('Successfully logged out!');
      $location.path('/');
    }).catch(function(err){
      console.log('Error logging out');
    });
  };
    socket.on('broadcast', function(data){
      console.log(data.description);
      ctrl.playerList = data.description;
      $scope.$apply();
    });


});
