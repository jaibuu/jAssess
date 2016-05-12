
var App = function(){

}

App.prototype.login = function(options = {new:false}){

	console.log('login', arguments);

    if(!!Session.get("test_username")){

        Meteor.call('join', {
        	'name': Session.get('test_username'),
        	'age' : Session.get('test_age'),
        	'isNew' : !!options.new
    	}, function(error, response){
				
			if(error) {
				console.warn(error, response);
				alert(error, response);
			} else {

				if(response == 0) {
				    localStorage.setItem("test_username", Session.get('test_username'));
				    localStorage.setItem("test_age", Session.get('test_age'));

				    if(!options.resume)
				        Router.go('/') 


				} else {
					Session.delete('test_username');
		            Session.set('welcome_error_message', response);
				}
			}

        })
    } else {
        console.log('No test_username, go to welcome');
        Router.go('/welcome') 
    }

}

App.prototype.logout = function(){
    localStorage.removeItem("test_username");
}

window.TestApp = new App();