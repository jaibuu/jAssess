
var App = function(){

}

App.prototype.login = function(){
    Meteor.call('join', 'Hallo')
}

window.TestApp = new App();
TestApp.login();