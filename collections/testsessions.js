TestSessions = new Mongo.Collection('TestSessions');

TestSessions.helpers({
  test() {
    return Tests.findOne(this.test_id);
  },

  current_question(){
	return Tests.findOne(this.test_id).questions[ this.current_question_idx ];

  }


});