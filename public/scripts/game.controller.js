angular.module('pokerApp').controller('GameController', function(GameService, MailService, UserService){
  var ctrl = this;
  ctrl.game = {'name' : '', 'date' : '', 'time' : '', 'leagues_id' : ''};
  var gamehash = 'this isn\'t right...';
  var users = 'neither is this...';
  var data = 'okay...';


    GameService.log();
    MailService.log();
    UserService.log();

    ctrl.create = function(game) {


      console.log('This is the game attributes: ', game);
      GameService.createGame(game).then(function(res) {
        gamehash = res.data;
        console.log('This is the game hash: ', gamehash);

      }).then(function() {
        UserService.getUsers().then(function(res) {
          users = res.data;
          console.log('This is the users hash: ', users);
          data = {game : gamehash, user : users};
          console.log('data in promise', data);

          MailService.sendEmail(data).then(function(res) {
            
          });
        });
      });



    }; // end ctrl.create

});
