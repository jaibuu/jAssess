// // counter starts at 0
// Session.setDefault('counter', 0);

// Template.hello.helpers({
//   counter: function () {
//     return Session.get('counter');
//   }
// });

// Template.hello.events({
//   'click button': function () {
//     // increment the counter when button is clicked
//     Session.set('counter', Session.get('counter') + 10);
//   }
// });





Template.registerHelper("log", function(something) {
  console.log(something);
});

// adds index to each item
UI.registerHelper('indexedArray', function(context, options) {
  if (context) {
    return context.map(function(item, index) {
      item._index = index;
      return item;
    });
  }
});


Router.route('/',  {
  action: function () {
    TestApp.login()
    this.render('TestTaker');
  }
});

  Template.TestTaker.helpers({
    
    Tests: function() {
      return Tests.find();
    },

    Questions: function() {
      if(TestSessions.findOne()){
          console.log('TestSessions found');
          return Tests.find(TestSessions.findOne().currentQuestion);
      } else {
          console.warn('No TestSessions found');
      }
    }
    
  });
Router.route('/welcome',  {
  action: function () {
    this.render('Welcome');
  }
});


Router.route('/tester', {
  //waitOn: function () {
  //  return IRLibLoader.load('//media.twiliocdn.com/sdk/rtc/js/ip-messaging/v0.8/twilio-ip-messaging.min.js');
  //},

  action: function () {


    Meteor.call('getSessions', function(err, data) {
      if (err)
        console.log(err);
      Session.set('gotSessions', data);
    });



    // Meteor.call('getList', function(err, data) {
    //   if (err)
    //     console.log(err);

    //   console.log('Call List Data', data);
    //   Session.set('gotSessions', data);
    // });

    this.render('TesterDashboard');
  }
});
  Template.TesterDashboard.helpers({ 
    Sessions : function(){
      return Session.get('gotSessions');
    }
});


Router.route('/viewer', {
  action: function () {
    this.render('ViewerScreen');
  }
});

Template.ViewerScreen.helpers({
  Question: function() {
    return Tests.findOne(TestSessions.findOne().currentQuestion);
  }
});

