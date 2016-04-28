
var App = function(){

}

App.prototype.login = function(){
    if(!!localStorage.getItem("test_username")){
        Meteor.call('join', localStorage.getItem("test_username"))
    } else {
        console.log('No test_username, go to welcome');
        Router.go('/welcome') 
    }

}

App.prototype.logout = function(){
    localStorage.removeItem("test_username");
}

window.TestApp = new App();