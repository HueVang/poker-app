angular.module('pokerApp').service('DigestService', function($http, $location) {
  var ctrl = this;

  ctrl.getDigests = function() {
    return $http.get('/digests').then(function(res) {
      return res
    })
  }; // end ctrl.getDigest

  ctrl.postDigest = function(digest) {
    return $http.post('/digests', digest).then(function(res) {
      return res;
    })
  }; // end ctrl.postDigest

  ctrl.log = function() {
    console.log('This is the digest service console log');
  }; // end ctrl.log

}); // end angular.module
