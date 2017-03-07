// routing
angular
  .module("pokerApp")
  .config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when("/home", {
        templateUrl: "views/home.html",
        controller: "HomeController as home",
        authRequired: true
      })
      .when("/newUser", {
        templateUrl: "views/register.html",
        controller: "RegisterController as register",
        authRequired: true
      })
      .when("/adminLeague", {
        templateUrl: "views/admin.league.html",
        controller: "RegisterController as register",
        authRequired: true
      })
      .when("/adminPlayer", {
        templateUrl: "views/admin.player.html",
        controller: "RegisterController as register",
        authRequired: true
      })
      .when("/createLeague", {
        templateUrl: "views/create.league.html",
        controller: "RegisterController as register",
        authRequired: true
      })
      .when("/newGame", {
        templateUrl: "views/schedule.game.html",
        controller: "GameController as game"
      })
      .otherwise({
        templateUrl: "views/login.html",
        controller: "LoginController as login"
      });
  })
  .run(function($rootScope, $location, $route, AuthService) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
      AuthService.checkLoginStatus().then(function(loggedIn) {
        console.log(loggedIn);
        if (next.authRequired && !loggedIn) {
          $location.path("/login");
          $route.reload();
        }
      });
    });
  });
