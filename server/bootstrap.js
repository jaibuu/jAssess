// run this when the meteor app is started
var em;

Meteor.startup(function() {


   em = new EventDDP('twoway');



  //load test
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
  Assets.getText("tests/messy.json", 
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

  Meteor.methods({
    join: function(participant) {

      console.log('Hello', participant, this.connection.id);

      //checking for new user, avoiding collision 
      if(participant.isNew == true){

        // if(Participants.find({'name' : { $regex : /^ sad asd$/i }  , 'connection_id': {$not: {$size: 0}}  } ).fetch().length)
        if(Participants.find({'name' : { $regex : new RegExp("^" + participant.name.trim(), "i") }  , 'connection_id': {$not: {$size: 0}}  } ).fetch().length)
          return "Nombre ya utilizado";
      }

      //checking for name changes
      if(Participants.findOne( {connection_id : this.connection.id } )) {

        Participants.upsert({
            // Selector
            connection_id: this.connection.id
        }, {
            // Modifier
            $set: {
                name: participant.name.trim(),
                age: participant.age,
                last_activity : new Date()
            }
        }, removeOldConnectionsFromParticipants);

      } else {
        // Handling multiple sessions on same browser, differnt session IDs but same name

        Participants.upsert({
            // Selector
            name: participant.name.trim()
        }, {
            // Modifier
            $set: {
                name: participant.name.trim(),
                age: participant.age,
                online: true,
                last_activity : new Date()
            },
            '$addToSet' : { "connection_id" : this.connection.id }
        }, removeOldConnectionsFromParticipants);

      }

      return 0;

    },


    endAllSessions: function() {
      TestSessions.update({active: true}, {$set: {active: false}});
    },

    forceNameChange: function(payload) {
      em.emit('forceNameChange', payload);
    },


    beginSession: function(session_id) {
      TestSessions.update({ 'id' : {'$ne' : session_id} }, {$set: {active: false}}, {multi: true});
      TestSessions.update({'_id' : session_id}, {$set: {active: true}});
      TestSessions.update({'_id' : session_id}, {$set: {current_question_idx: 0}});
    },


    IncreaseCurrentTestQuestionIndex: function(){
      console.log('INCREASING ac');
      TestSessions.update( {'active': true}, { $inc : { "current_question_idx" : 1 } });
    },


    DecreaseCurrentTestQuestionIndex: function(){
      console.log('DECREASING ac');
      TestSessions.update( {'active': true}, { $inc : { "current_question_idx" : -1 } });
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
      if(typeof old_ids == 'string') old_ids = [old_ids];
      var old_ids_snapshot = JSON.stringify(old_ids);

      if(!old_ids) return;

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



  Meteor.onConnection(function (conn) {
    var connId = conn.id;

    console.log('welcome, ', connId);
    conn.onClose(function () {
      console.log('bye ', connId);
    });
  });


  Meteor.publish("SessionAnswers", function () {
    ReactiveAggregate(this, Answers, [{
      $group: {
        _id: "$name",
        answers: { $push: "$$ROOT" }
      }
    }], { clientCollection: "SessionAnswersLive" });
  });


});





