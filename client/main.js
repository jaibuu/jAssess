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

    TestSession: function() {
      if(TestSessions.findOne({'active': true}) && TestSessions.findOne({'active': true}).current_question_idx < TestSessions.findOne({'active': true}).test().questions.length){
        return TestSessions.findOne({'active': true});
      } else {
        return false;
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
    AvailableParticipants : function(){
      return Participants.find({'connection_id': {$not: {$size: 0}}  } ).fetch()
    },
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

        Router.go('/session/' + session);

      })

    }
  });


Router.route('/session/:_id', {
  //waitOn: function () {
  //  return IRLibLoader.load('//media.twiliocdn.com/sdk/rtc/js/ip-messaging/v0.8/twilio-ip-messaging.min.js');
  //},
  action: function () {
    this.render('SessionDashboard');
  }
});
  Template.SessionDashboard.helpers({
    Participants : function(){
      return Participants.find()
    },
    TestSession: function() {
      return TestSessions.findOne({'active': true});
    },
    nextQuestion : function (){
      if(TestSessions.findOne({'active': true})) {
        if(TestSessions.findOne({'active': true}).current_question_idx < TestSessions.findOne({'active': true}).test().questions.length-1){
          return TestSessions.findOne({'active': true}).test().questions[  TestSessions.findOne({'active': true}).current_question_idx+1 ];
        } else {
          return false;
        }
      }
    }
  });
  
  Template.SessionDashboard.events({
    'click .finish_session' : function(event){
      event.preventDefault();

      //setting sessions to inactive
      TestSessions.update( {'_id': TestSessions.findOne({'active': true})._id}, { 'active' : 'false' });

      Router.go('/tester');
    },

    'click .next_question' : function(event){
      event.preventDefault();

      console.log('next_question', TestSessions.findOne({'active': true}).current_question_idx < TestSessions.findOne({'active': true}).test().questions.length-1);

      if(TestSessions.findOne({'active': true}).current_question_idx < TestSessions.findOne({'active': true}).test().questions.length-1) {

        Meteor.call('IncreaseCurrentTestQuestionIndex', function(err, data) {
          console.log('Current Test Question Index Increased');
        });

      } else {
        return false;
      }



    }

  });



Router.route('/viewer', {
  action: function () {
    this.render('ViewerScreen');
  }
});
  Template.ViewerScreen.helpers({
    TestSession: function() {

        if(TestSessions.findOne({'active': true}) && TestSessions.findOne({'active': true}).current_question_idx < TestSessions.findOne({'active': true}).test().questions.length){
          return TestSessions.findOne({'active': true});
        } else {
          return false;
        }

    }
  });



