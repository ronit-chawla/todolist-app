const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema({
	todo      : String,
	createdAt : { type: Date, default: Date.now },
	author    : {
		id       : {
			type    : mongoose.Schema.Types.ObjectId,
			ref     : 'User',
			dueDate : Date,
			pastDue : Boolean
		},
		username : String
	}
});
module.exports = mongoose.model('Todo', todoSchema);
