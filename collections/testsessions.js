TestSessions = new Mongo.Collection('TestSessions');

TestSessions.helpers({
  test() {
    return Tests.findOne(this.test_id);
  },

  current_question(){
  	var current_question = Tests.findOne(this.test_id).questions[ this.current_question_idx ];

  	for (var i = Tests.findOne(this.test_id).question_types.length - 1; i >= 0; i--) {
  		if(Tests.findOne(this.test_id).question_types[i].name == current_question.type){
  			current_question.options = Tests.findOne(this.test_id).question_types[i];
  		}
  	}
  	

	return current_question;
  }


});