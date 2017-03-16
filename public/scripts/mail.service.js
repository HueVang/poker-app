angular.module('pokerApp').service('MailService', function($http, $location) {
  var ctrl = this;

  ctrl.sendEmailPlayers = function(data) {
    return $http.post('/reservations/players', data).then(function(res) {
      return res;
    });
  }; // end ctrl.sendEmail

  ctrl.sendEmailRegulars = function(data) {
    return $http.post('/reservations/regulars', data).then(function(res) {
      return res;
    });
  }; // end ctrl.sendEmail

  ctrl.inviteNewPlayer = function(newPlayerEmail){
    var data = newPlayerEmail;
    return $http.post('/users/newPlayer', data).then(function(res) {
      return res;
    });
  } // end ctrl.inviteNewPlayer

  ctrl.log = function() {
    console.log('This is the mail service console log');
  }; // end ctrl.log

});
