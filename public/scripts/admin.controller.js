angular.module('pokerApp').controller('AdminController', function(LeagueService, GameService, $http, $location){
  var ctrl = this;

  ctrl.league = {'name' : '', 'start_date' : '', 'end_date' : ''};
  ctrl.leagues = [{},{},{}];
  ctrl.games = [{},{},{}];

  console.log('AdminController loaded');

  ctrl.createLeague = function(league) {
    LeagueService.createLeague(league).then(function(res) {
      console.log('This is the league response: ', res.data);
    })
  }; // end ctrl.createLeague

  ctrl.getLeagues = function() {
    LeagueService.getLeagues().then(function(res) {
      ctrl.leagues = res.data;
      console.log('This is the leagues array: ', ctrl.leagues);
    })
  }; // end ctrl.getLeagues

  ctrl.getLeagues();

  ctrl.getGames = function(leagueId) {
    GameService.getGames(leagueId).then(function(res) {
      ctrl.games = res.data;
      console.log('This is the games array: ', ctrl.games);
    })
  }; // end ctrl.getGames

  ctrl.getGames();

  ctrl.newGame = function() {
    $location.path('newGame');
  }; // end ctrl.newGame

  ctrl.editGame = function() {
    $location.path('editGame');
  }; // end ctrl.endGame


});
