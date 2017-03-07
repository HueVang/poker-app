angular.module('pokerApp').controller('GameController', function(GameService, MailService, UserService){
  var ctrl = this;
  ctrl.newGame = {'name' : '', 'date' : '', 'time' : '', 'leagues_id' : ''};
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
        regulars = [];
        players = [];

        users.forEach(function(person) {
          if (person.regular) {
            console.log('This person is a regular: ', person.name);
            regulars.push(person);
          } else {
            console.log('This person is a player: ', person.name);
            players.push(person);
          }
        });


        regulardata = {game : gamehash, user : regulars};
        playerdata = {game : gamehash, user : players};

        MailService.sendEmailRegulars(regulardata).then(function(res) {

        });

        MailService.sendEmailPlayers(playerdata).then(function(res) {

        });



      });
    });



  }; // end ctrl.create

});
