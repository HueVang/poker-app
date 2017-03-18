angular.module('pokerApp').service('LeagueService', function($http, $location) {
  var ctrl = this;

  ctrl.createLeague = function(league) {
    return $http.post('/leagues', league).then(function(res) {
      return res;
    });
  };// end ctrl.createLeague

  ctrl.getLeagueList = function(){
    return $http.get('/leagues/getCurrent/leagues').then(function(res){
      return res;
    });
  }

  ctrl.getLeagues = function() {
    return $http.get('/leagues').then(function(res) {
      return res;
    });
  }; // end ctrl.getLeagues

  ctrl.getLeaderboard = function(leagueId) {
    return $http.get('/reservations/leaderboard/' + leagueId).then(function(res) {
      return res;
    });
  }; // end ctrl.getLeaderboard

  ctrl.getWinners = function(leagueId) {
    return $http.get('/reservations/winners/' + leagueId).then(function(res) {
      return res;
    })
  }; // end ctrl.getWinners

  ctrl.log = function() {
    console.log('This is the league service console log');
  };

});
