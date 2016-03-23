var mongoose = require('mongoose');

var TeamSchema = new mongoose.Schema({
  
  name: {
  	type: String,
  	required: true
  },
  administrator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]

});

mongoose.model('Team', TeamSchema);