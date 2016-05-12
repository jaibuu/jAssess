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


Session.set('test_username', localStorage.getItem("test_username"));
Session.set('test_age', localStorage.getItem("test_age"));
TestApp.login({resume:true});

Template.registerHelper('session',function(input){
  return Session.get(input);
});

Template.registerHelper("log", function(something) {
  console.log(something);
});

Template.registerHelper("myname", function() {
  return Participants.findOne( {connection_id : Meteor.default_connection._lastSessionId} ).name;
});

Template.registerHelper("hasAnswered", function(participantName) {
  return !!Answers.findOne({
      // connection_id : Meteor.default_connection._lastSessionId,
      name: participantName,
      session_id: TestSessions.findOne({'active': true})._id,
      test_id: TestSessions.findOne({'active': true}).test()._id,
      question_idx: TestSessions.findOne({'active': true}).current_question_idx
    });
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

UI.registerHelper('equals',  function(v1, v2) {
    return (v1 == v2);
});

Router.route('/',  {
  action: function () {
    if(!localStorage.getItem("test_username")){
      return Router.go('/welcome') 
    }
    TestApp.login({resume:true});

    this.render('TestTaker');

     // Participants.findOne( {connection_id : Meteor.default_connection._lastSessionId} ).observe({
     //    changed: function(newDoc, oldDoc) {
     //      console.log('changed', newDoc, oldDoc);
     //    }

     //  });


  }
});
  
  Template.TestTaker.findLastAnswer = function() {

    if(!TestSessions.findOne({'active': true}) ) {
      return false;
    }

    //Are there any answers already for this test, this person, and this question number for this session?

    if(!Participants.findOne( {connection_id : Meteor.default_connection._lastSessionId} )){
      console.log('login, ', findLastAnswer); TestApp.login({resume:true});
    }

    return Answers.findOne({
      // connection_id : Meteor.default_connection._lastSessionId,
      name: Participants.findOne( {connection_id : Meteor.default_connection._lastSessionId} ).name,
      session_id: TestSessions.findOne({'active': true})._id,
      test_id: TestSessions.findOne({'active': true}).test()._id,
      question_idx: TestSessions.findOne({'active': true}).current_question_idx
    });

  };

  Template.TestTaker.helpers({
    
    Tests: function() {
      return Tests.find();
    },

    lastAnswer: Template.TestTaker.findLastAnswer,

    TestSession: function() {
      if(TestSessions.findOne({'active': true}) && TestSessions.findOne({'active': true}).current_question_idx < TestSessions.findOne({'active': true}).test().questions.length){
        return TestSessions.findOne({'active': true});
      } else {
        return false;
      }
    }
    
  });

  Template.TestTaker.events({

    // handle the form submission
    'submit form': function(event) {
      // stop the form from submitting
      event.preventDefault();
      Template.TestTaker.ProcessSubmission(event.target);
    },
    'change input[type="radio"]': function(event) {
      event.preventDefault();
      Template.TestTaker.ProcessSubmission(event.target.form);
    },
    'click .reject' : function(event){
      //> Answers.findOne({}, {"sort": {"created_at": -1}})
      event.preventDefault();
      Answers.update(Template.TestTaker.findLastAnswer()._id, { 'rejected' : true });
    }

  });

  Template.TestTaker.ProcessSubmission = function(form){

    if(form.dataset.type == "radio"){

      window._form = form;

      console.log('processed', form.elements.selection.value, form.dataset.type);

    if(!Participants.findOne( {connection_id : Meteor.default_connection._lastSessionId} )){
       TestApp.login({resume:true});
    }


      Template.TestTaker.currentQuestionSubmission = {
        created_at: new Date(),   
        session_id: TestSessions.findOne({'active': true})._id,
        name: Participants.findOne( {connection_id : Meteor.default_connection._lastSessionId} ).name ,
        age: Participants.findOne( {connection_id : Meteor.default_connection._lastSessionId} ).age ,
        connection_id : Meteor.default_connection._lastSessionId,
        test_id: TestSessions.findOne({'active': true}).test()._id,
        test_name: TestSessions.findOne({'active': true}).test().name,
        question_idx: TestSessions.findOne({'active': true}).current_question_idx,
        question_label: TestSessions.findOne({'active': true}).current_question().label,
        option_label: TestSessions.findOne({'active': true}).current_question().options.values[   form.elements.selection.value   ].label,
        option: form.elements.selection.value
      };

      var newAnswer =  Template.TestTaker.currentQuestionSubmission;

      // Template.TestTaker._last_answer_id = Answers.insert(newAnswer); // this wouldn't work for multiple sessions
      if( Template.TestTaker.findLastAnswer() ) Answers.update(Template.TestTaker.findLastAnswer()._id, { 'rejected' : true });
      Answers.insert(newAnswer);

    } else {
      console.log('No handler for this type of form');
    }

  };



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
    OngoingSessions : function(){
      return TestSessions.find( {active : true} )
    },
    AvailableParticipants : function(){
      return Participants.find({'connection_id': {$not: {$size: 0}}  } )
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

    },

    'click .end-all-sessions' : function(event){
      event.preventDefault();
      Meteor.call('endAllSessions', function(err, data) {
        console.log('Sessions ended');

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

  Template.SessionDashboard.events({
      'click button': function(event) {

        // stop the form from submitting
        event.preventDefault();


        // this.name = event.target.closest('form').querySelector('input').value;
        // this.save();

        var result = Participants.update({_id: this._id}, { name:  event.target.form.name.value});

           console.log(    result,  this._id  );


        // console.log(event.target.form.name.value, event.target.closest('form').querySelector('input').value);



      }
  });


  Template.SessionDashboard.helpers({
    SessionParticipants : function(){
      return Participants.find({last_activity : {$gt: TestSessions.findOne({active:true}).created_at }})
    },
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
    },
    prevQuestion : function (){
      if(TestSessions.findOne({'active': true})) {
        if(TestSessions.findOne({'active': true}).current_question_idx > 0){
          return TestSessions.findOne({'active': true}).test().questions[  TestSessions.findOne({'active': true}).current_question_idx-1 ];
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

    },

    'click .prev_question' : function(event){
      event.preventDefault();


      if(TestSessions.findOne({'active': true}).current_question_idx > 0) {

        Meteor.call('DecreaseCurrentTestQuestionIndex', function(err, data) {
          console.log('Current Test Question Index Decreased');
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



//current name:   Participants.findOne( {connection_id : Meteor.default_connection._lastSessionId} ).name


 

