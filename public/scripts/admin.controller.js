angular.module('pokerApp').controller('AdminController', function(LeagueService, $http, $location){
  var ctrl = this;

  ctrl.league = {'name' : '', 'start_date' : '', 'end_date' : ''};

  console.log('AdminController loaded');

  ctrl.createLeague = function(league) {
    LeagueService.createLeague(league).then(function(res) {
      console.log('This is the league response: ', res.data);
    })
  }; // end ctrl.createLeague

  ctrl.newGame = function() {
    $location.path('newGame');
  }; // end ctrl.newGame


});
