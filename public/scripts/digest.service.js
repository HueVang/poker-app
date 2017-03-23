angular.module('pokerApp').service('DigestService', function($http, $location) {
  var ctrl = this;

  ctrl.getDigests = function() {
    return $http.get('/digests').then(function(res) {
      var arrayOfArrays = [];
      var digests = res.data.reverse();
      var arrayToPush = [];
      digests.forEach(function(digest, index){
        if(index == digests.length-1){
          digest.date = new Date(digest.date).toDateString();
          arrayToPush.push(digest);
          arrayOfArrays.push(arrayToPush);
          console.log('this is in if: ', arrayToPush);
        }else if(arrayToPush.length < 5){
          digest.date = new Date(digest.date).toDateString();
          arrayToPush.push(digest);
          console.log('this is in else if: ', arrayToPush);
        }else{
          arrayOfArrays.push(arrayToPush);
          arrayToPush = [];
          digest.date = new Date(digest.date).toDateString();
          arrayToPush.push(digest);
        }
      });
      return arrayOfArrays;
    });
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
