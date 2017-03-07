angular.module('pokerApp').service('MailService', function($http, $location) {
  var ctrl = this;

  ctrl.sendEmail = function(data) {
    return $http.post('/reservations', data).then(function(res) {
      return res;
    })
  }; // end ctrl.sendEmail

  ctrl.log = function() {
    console.log('This is the mail service console log');
  }; // end ctrl.log

});
