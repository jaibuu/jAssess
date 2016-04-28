Template.welcomeForm.events({

  // handle the form submission
  'submit form': function(event) {

    // stop the form from submitting
    event.preventDefault();
    localStorage.setItem("test_username", event.target.name.value);
    Router.go('/') 

  }

});