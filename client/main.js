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

UI.registerHelper('formatTime', function(context, options) {
  if(context)
    return moment().format('HH:mm - ss\\s');
});


UI.registerHelper('fromNowTime', function(context, options) {
  if(context)
    return moment(context).fromNow();
});


UI.registerHelper('currentTime', function(context, options) {
    return moment().format('YYYY/MM/DD, HH:mm - ss\\s');
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
    this.render('TesterDashboard');
  }
});
  Template.TesterDashboard.helpers({
    Participants : function(){
      return Participants.find()
    },
    Tests : function(){
      return Tests.find()
    },
  });
  
  Template.TesterDashboard.events({
    'click .start-session' : function(event){
      

      // stop the form from submitting
      event.preventDefault();

      // get the data we need from the form
      var session_data = {
        'created_at' : new Date(),
        'test_id' : this._id
      };
      var session = TestSessions.insert(session_data);
      console.log('Created session for ', this.name);



      Meteor.call('beginSession', session, function(err, data) {
        console.log('Session Started');
      });
       
      // // create the new poll
      // TestSessions.insert(newTest);


    }
  });



Router.route('/test', {
  //waitOn: function () {
  //  return IRLibLoader.load('//media.twiliocdn.com/sdk/rtc/js/ip-messaging/v0.8/twilio-ip-messaging.min.js');
  //},

  action: function () {
    this.render('TestDashboard');
  }
});
  Template.TestDashboard.helpers({
    Participants : function(){
      return Participants.find()
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

