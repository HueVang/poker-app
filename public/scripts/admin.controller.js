angular.module('pokerApp').controller('AdminController', function(LeagueService, GameService, UserService, $http, $location){
  var ctrl = this;

  ctrl.league = {'name' : '', 'start_date' : '', 'end_date' : ''};
  ctrl.leagues = [{},{},{}];
  ctrl.games = [{},{},{}];
  ctrl.leaderboard = [{},{},{}];
  ctrl.winners = [{},{},{}];

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


  ctrl.getLeaderboard = function(leagueId) {
    LeagueService.getLeaderboard(leagueId).then(function(res) {
      ctrl.leaderboard = res.data;
    })
  }; // end ctrl.leaderboard

  ctrl.getWinners = function(leagueId) {
    LeagueService.getWinners(leagueId).then(function(res) {
      ctrl.winners = res.data;
      ctrl.winners.forEach(function(winner) {
        winner.date = new Date(winner.date).toDateString();
        console.log('This is the new date: ', winner.date);
      }) // end ctrl.winners.forEach
    })
  }; // end ctrl.getWinners


  ctrl.newGame = function() {
    $location.path('newGame');
  }; // end ctrl.newGame


  ctrl.logout = function() {
    $http.delete('/login').then(function(){
      console.log('Successfully logged out!');
      $location.path('/');
    }).catch(function(err){
      console.log('Error logging out');
    });
  };

  ctrl.editGame = function(game) {
    GameService.getGameEdit(game);
    $location.path('editGame');
  }; // end ctrl.endGame

  //added
//
ctrl.getPlayerRosterData = function(){
  ctrl.playerRosterList =[];
    console.log('in getPlayerRosterData');
  UserService.getPlayerRoster().then(function (response) {
      console.log('OK');
      console.log('response', response);
ctrl.playerRosterList = response;
    });
  };
  ctrl.getPlayerRosterData();

  ctrl.savePlayerRoster = function(){
    ctrl.playerRosterObject = {
      first_name:ctrl.first_name,
      last_name:ctrl.last_name,
      username:ctrl.username,
      email:ctrl.email
    };
    console.log('in savePlayerRoster');
    UserService.savePlayerRoster(ctrl.playerRosterObject).then(function(){
    ctrl.getPlayerRosterData();
    });
  };
  ctrl.checkAdminStatus = function() {
        UserService.checkAdminStatus().then(function(res) {
         console.log(res.data);
         if(res.data == true){
           ctrl.admin = true;
         }else{
           ctrl.admin = false;
         }
        });
      };

});
