angular.module('pokerApp').service('ReservationService', function($http, $location) {
  var ctrl = this;

  ctrl.removeFromGame = function(user, currentGame){
    var game_id = currentGame.id;
    return $http.put('/reservations/remove/'+user+'&'+game_id).then(function(res) {
      console.log('This is user.service.js res: ', res);
      return res;
    });
  }; // end ctrl.removeFromGame

  ctrl.getPlayerPoints = function(gameId){
    return $http.get('/reservations/playerPoints/' + gameId).then(function(res) {
      console.log('getPlayerPoints returns: ', res);
      return res;
    })
  }; // end ctrl.getPlayerPoints

  ctrl.givePlayerPoints = function(person){
    return $http.put('/reservations/givePlayerPoints/', person).then(function(res) {
      console.log('givePlayerPoints returns: ', res);
      return res;
    })
  }; // end ctrl.givePlayerPoints

  ctrl.removePoints = function(reservationId){
    return $http.put('/reservations/playerPoints/' + reservationId).then(function(res){
      console.log('removePoints returns: ', res);
      return res;
    });
  }; // end ctrl.removePoints

  ctrl.getUsersInGame = function(gameId){
    return $http.get('/reservations/usersInGame/' + gameId).then(function(res){
      console.log('getUsersInGame returns: ', res);
      return res;
    });
  }; // end ctrl.getUsersInGame

});
