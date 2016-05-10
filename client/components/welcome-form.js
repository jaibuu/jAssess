Template.welcomeForm.events({

  // handle the form submission
  'submit form': function(event) {

    // stop the form from submitting
    event.preventDefault();
    if(event.target.name) {
        if(event.target.name.value.indexOf(' ') > -1 ) {
            Session.set('test_username', event.target.name.value);
            Session.set('test_age', null);
            Session.set('welcome_error_message', '');
        } else {
            Session.set('welcome_error_message', 'Escribe tu nombre y apellido separados por un espacio');
        }
    } 
    if(event.target.age) {
        Session.set('test_age', event.target.age.value);
    }


    //if everyrhing is filled
    if(Session.get('test_username') && Session.get('test_age')){

        TestApp.login(true);
        // Router.go('/') 
    }


  }

});

  Template.welcomeForm.helpers({
    TestAge: function(){
      return Session.get('test_age');
    },
    TestUsername: function(){
      return Session.get('test_username');
    },
    ErrorMessage: function(){
      return Session.get('welcome_error_message');
    },
    Label : function(){
      return Session.get('test_username') ? 'Entrar' : 'Siguiente';
    }
  });