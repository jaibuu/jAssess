// run this when the meteor app is started
Meteor.startup(function() {

  // if there are no tests available create sample data
  if (Tests.find().count() === 0) {

    // create sample Tests
    var sampleTests = [
      {
        question: 'Is it awesome?',
        choices: [
          { text: 'Of course!', votes: 0 },
          { text: 'Eh', votes: 0 },
          { text: 'No. I prefer paper', votes: 0 }
        ]
      },
      {
        question: 'Is it working?',
        choices: [
          { text: '100% yes', votes: 0 },
          { text: '200% yes', votes: 0 },
          { text: '300% yes', votes: 0 }
        ]
      }
    ];

    // loop over each sample test and insert into database
    _.each(sampleTests, function(test) {
      Tests.insert(test);
    });

  }



  if (TestSessions.find().count() === 0) {

    // create sample TestSessions
    var sampleTestSessions = [
      {
        currentQuestion: Tests.findOne()._id,
        active:true
      }
    ];

    // loop over each sample testSession and insert into database
    _.each(sampleTestSessions, function(testSession) {
      TestSessions.insert(testSession);
    });

  }



  Meteor.methods({
    join: function(name) {

      console.log('Hello', name, this.connection.id);
      return Participants.insert({ name: name, online: true, connection_id: this.connection.id });


    },
    online: function(isOnline) {
      if (isOnline == null) {
        isOnline = true;
      }
      return Meteor.users.update(Meteor.userId(), {
        $set: {
          online: isOnline
        }
      });
    },
    getSessions : function(){
      // console.log(Meteor.server.sessions);
      return Object.keys(Meteor.server.sessions)
    },
    getList : function(){
      // console.log(Meteor.server.sessions);
      return ['asd', 'etc'];
    }

  });

});
