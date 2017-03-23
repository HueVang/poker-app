angular.module('pokerApp').controller('AdminController', function(MailService, LeagueService, GameService, UserService, $http, $location){
  var ctrl = this;
  var user;

  ctrl.leagues = [{},{},{}];
  ctrl.games = [{},{},{}];
  ctrl.leaderboard = [{},{},{}];
  ctrl.winners = [{},{},{}];
  ctrl.autoCompleteArray = [];
  ctrl.username;
  ctrl.allPlayers = [];
  ctrl.emailInput = false;

  console.log('AdminController loaded');

  ctrl.createLeague = function(league) {
    LeagueService.createLeague(league).then(function(res) {
      console.log('This is the league response: ', res.data);
      alertify.warning('New league successfully created.');
    });
  }; // end ctrl.createLeague

  ctrl.getLeagues = function() {
    LeagueService.getLeagues().then(function(res) {
      ctrl.leagues = res.data;
      console.log('This is the leagues array: ', ctrl.leagues);
      console.log('This should be the last league\'s value: ', ctrl.leagues[ctrl.leagues.length - 1].id.toString());
      ctrl.getGames(ctrl.leagues[ctrl.leagues.length - 1].id);
      ctrl.getLeaderboard(ctrl.leagues[ctrl.leagues.length - 1].id);
      ctrl.getWinners(ctrl.leagues[ctrl.leagues.length - 1].id);
      ctrl.league = ctrl.leagues[ctrl.leagues.length - 1];
      console.log('This is the last league in the array: ', ctrl.league);
    });

  }; // end ctrl.getLeagues

  ctrl.getLeagues();




  ctrl.getGames = function(leagueId) {
    GameService.getGames(leagueId).then(function(res) {
      ctrl.games = res.data;
      ctrl.games.forEach(function(game) {
        game.date = new Date(game.date).toDateString();
      });
      console.log('This is the games array: ', ctrl.games);
    });
  }; // end ctrl.getGames


  ctrl.getLeaderboard = function(leagueId) {
    LeagueService.getLeaderboard(leagueId).then(function(res) {
      ctrl.leaderboard = res.data;
    });
  }; // end ctrl.leaderboard

  ctrl.getWinners = function(leagueId) {
    LeagueService.getWinners(leagueId).then(function(res) {
      ctrl.winners = res.data;
      console.log('This is the ctrl.winners: ', res.data);
      ctrl.winners.forEach(function(winner) {
        winner.date = new Date(winner.date).toDateString();
        console.log('This is the new date: ', winner.date);
      }); // end ctrl.winners.forEach
    });
  }; // end ctrl.getWinners


  ctrl.newGame = function(leagueId) {
    GameService.saveLeagueId(leagueId);
    $location.path('newGame');
  }; // end ctrl.newGame


  ctrl.logout = function() {
    $http.delete('/login').then(function(){
      console.log('Successfully logged out!');
      alertify.warning('You are now signed out.');
      $location.path('/');
    }).catch(function(err){
      console.log('Error logging out');
    });
  };

  ctrl.createLeaguePage = function() {
    $location.path('createLeague');
  }; // end ctrl.createLeaguePage

  ctrl.editGame = function(game) {
    GameService.getGameEdit(game);
    $location.path('editGame');
  }; // end ctrl.endGame

  ctrl.cancel = function() {
    $location.path('adminLeague');
    alertify.error('League creation cancelled');
  }; // end ctrl.cancel

  ctrl.getPlayerRosterData = function(){
    ctrl.playerRosterList =[];
    console.log('in getPlayerRosterData');
    UserService.getPlayerRoster().then(function (response) {
      response.forEach(function(person){
        person.searchCriteria = person.first_name + ' ' + person.last_name + ' (' + person.username + ') '+person.email;
      });
      ctrl.allPlayers = response;
      ctrl.playerRosterList = response;
    });
  };

  ctrl.getPlayerRosterData();

  ctrl.checkAdminStatus = function() {
    UserService.getCurrentUser().then(function(res) {
      console.log(res.data);
      user = res.data.user;
      if(user.admin == true){
        ctrl.admin = true;
      }else{
        ctrl.admin = false;
      }
    });
  };

  ctrl.checkAdminStatus();

  ctrl.showPlayerProfile = function(player){
    UserService.savePlayerProfile(player);
  };


  ctrl.showEditProfile = function(player){
    UserService.saveEditProfile(player);
  };

  ctrl.getautoCompleteArray = function() {
    UserService.getUsers().then(function(res){
      res.data.forEach(function(person){
        var playerName = person.first_name + ' ' + person.last_name + ' (' + person.username + ')';
        ctrl.autoCompleteArray.push(playerName);
      });
      console.log('This is the autoCompleteArray:', ctrl.autoCompleteArray);
    });
  }; // end ctrl.getautoCompleteArray

  ctrl.getautoCompleteArray();

  ctrl.jumpToUser = function(){
    console.log("changing");
    if(ctrl.username == null){
      ctrl.playerRosterList = ctrl.allPlayers;
    }else{
      ctrl.playerRosterList = [];
      ctrl.allPlayers.forEach(function(person){
        var caseInsensitive = person.searchCriteria.toUpperCase();
        if(caseInsensitive.includes(ctrl.username.toUpperCase())){
          ctrl.playerRosterList.push(person);
        }
      });
    }
  }

  ctrl.showEmailInput = function(){
    if(ctrl.emailInput == false){
      ctrl.emailInput = true;
    }else{
      ctrl.emailInput = false;
    }
  }

  ctrl.inviteNewPlayer = function(newPlayerEmail){
    console.log(typeof newPlayerEmail);
    var invitedPlayer = {email : newPlayerEmail};
    MailService.inviteNewPlayer(invitedPlayer).then(function(res){
      console.log(res);
    ctrl.newPlayerEmail = '';
    alertify.success('Invite sent to new player!');
    });
  }


});
