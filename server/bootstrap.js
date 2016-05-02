// run this when the meteor app is started
Meteor.startup(function() {


  //load test
  // var loadedTest = HTTP.get(Meteor.absoluteUrl("./tests/staic.json")).data;

  Assets.getText("tests/staic.json", 
    function(err, result){
      if(err){
        console.log("Assets err: " + err);
      }
      if(result){

        var loadedTest = JSON.parse(result);

        if(loadedTest.name){
          console.log("Asset log: "  + "Importing Test");
          console.log(loadedTest);


          Tests.upsert({
              // Selector
              name: loadedTest.name,
          }, {
              // Modifier
              $set: loadedTest
          });


        } else {
          console.log("Assets err: "  + "Invalid test" + loadedTest['name']);
          console.log(loadedTest);
        }
      }
    }
  );




  // // if there are no tests available create sample data
  // if (Tests.find().count() === 0) {

  //   // create sample Tests
  //   var sampleTests = [
  //     {
  //       question: 'Is it awesome?',
  //       choices: [
  //         { text: 'Of course!', votes: 0 },
  //         { text: 'Eh', votes: 0 },
  //         { text: 'No. I prefer paper', votes: 0 }
  //       ]
  //     },
  //     {
  //       question: 'Is it working?',
  //       choices: [
  //         { text: '100% yes', votes: 0 },
  //         { text: '200% yes', votes: 0 },
  //         { text: '300% yes', votes: 0 }
  //       ]
  //     }
  //   ];

  //   // loop over each sample test and insert into database
  //   _.each(sampleTests, function(test) {
  //     Tests.insert(test);
  //   });

  // }



  if (TestSessions.find().count() === 0) {

    // // create sample TestSessions
    // var sampleTestSessions = [
    //   {
    //     currentQuestion: Tests.findOne()._id,
    //     active:true
    //   }
    // ];

    // // loop over each sample testSession and insert into database
    // _.each(sampleTestSessions, function(testSession) {
    //   TestSessions.insert(testSession);
    // });

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
              last_activity : new Date()
          },
          '$addToSet' : { "connection_id" : this.connection.id }
      }, removeOldConnectionsFromParticipants);

    },


    beginSession: function(session_id) {

      console.log(session_id);

      TestSessions.update({ 'id' : {'$ne' : session_id} }, {$set: {active: false}}, {multi: true});
      TestSessions.update({'_id' : session_id}, {$set: {active: true}});


    }

  });

  /* HELPERS */
  var _oldsessions = JSON.stringify([]);

  Meteor.setInterval(function() {

    if(_oldsessions !=  JSON.stringify(Object.keys(Meteor.server.sessions))){
      removeOldConnectionsFromParticipants();
      _oldsessions = JSON.stringify(Object.keys(Meteor.server.sessions));
    }

  }, 1000);


  //cleanup of expired sessions
  var removeOldConnectionsFromParticipants = function(){ 
    Participants.find().fetch().forEach( function(Participant) {

      var old_ids = Participant.connection_id;
      var old_ids_snapshot = JSON.stringify(old_ids);



      var new_ids = old_ids.filter(function(n) {
        return Object.keys(Meteor.server.sessions).indexOf(n) != -1;
      });

      var new_ids_snapshot = JSON.stringify(new_ids);

      var newData = { $set : { connection_id :  new_ids  } };

      if(old_ids_snapshot != new_ids_snapshot) {
        newData['$set']['last_activity'] = new Date();
      }




      Participants.update({ _id : Participant._id },  newData);

    });
  };

});





