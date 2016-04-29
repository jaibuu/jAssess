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

      Participants.upsert({
          // Selector
          name: name,
      }, {
          // Modifier
          $set: {
              name: name,
              online: true,
              // connection_id:  ['ok', this.connection.id, 'bla']
          },
          '$addToSet' : { "connection_id" : this.connection.id }
      }, removeOldConnectionsFromParticipants);






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


      return Participants.find( {connection_id : { $in: Object.keys(Meteor.server.sessions)  }} ).fetch()
    },
    getList : function(){
      // console.log(Meteor.server.sessions);
      return ['asd', 'etc'];
    }

  });

/* HELPERS */

  var _oldsessions = JSON.stringify([]);
  var interval = setInterval( function(){
    if(_oldsessions !=  JSON.stringify(Object.keys(Meteor.server.sessions))){
      removeOldConnectionsFromParticipants();
      _oldsessions = JSON.stringify(Object.keys(Meteor.server.sessions));
    }

  }, 1000);

});



/* HELPERS */

var removeOldConnectionsFromParticipants = function(){ 

  //cleanup of expired sessions

    Participants.find().fetch().forEach( function(Participant) {

      var old_ids = Participant.connection_id;

      old_ids = old_ids.filter(function(n) {
        return Object.keys(Meteor.server.sessions).indexOf(n) != -1;
      });

      Participants.update({ _id : Participant._id }, { $set : { connection_id :  old_ids  } });
    });

};





