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


Template.TestTaker.helpers({
  
  Tests: function() {
    return Tests.find();
  }
  
});


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
    this.render('TestTaker');
  }

});

Router.route('/tester', {
//   waitOn: function () {
//     return IRLibLoader.load('//media.twiliocdn.com/sdk/rtc/js/ip-messaging/v0.8/twilio-ip-messaging.min.js');
//   },

  action: function () {
    this.render('TesterDashboard');
  }
});



Router.route('/viewer', {
  action: function () {
    this.render('ViewerScreen');
  }
});


