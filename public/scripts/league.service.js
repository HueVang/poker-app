angular.module('pokerApp').service('LeagueService', function($http, $location) {
  var ctrl = this;

  ctrl.createLeague = function(league) {
    return $http.post('/leagues', league).then(function(res) {
      return res;
    })
  } // end ctrl.createLeague

  ctrl.log = function() {
    console.log('This is the league service console log');
  };

});
