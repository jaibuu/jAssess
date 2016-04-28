
// attach events to our test template
Template.test.events({

  // event to handle clicking a choice
  'click .vote': function(event) {

    // prevent the default behavior
    event.preventDefault();
  
    // get the parent (test) id
    var testID = $(event.currentTarget).parent('.test').data('id');
    var voteID = $(event.currentTarget).data('id');

    // create the incrementing object so we can add to the corresponding vote
    var voteString = 'choices.' + voteID + '.votes';
    var action = {};
    action[voteString] = 1;
    
    // increment the number of votes for this choice
    Tests.update(
      { _id: testID }, 
      { $inc: action }
    );

  }

});