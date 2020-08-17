const mongoose = require('mongoose');
const todoSchema = new mongoose.Schema({
	todo       : String,
	createdAt  : { type: Date, default: Date.now },
	striked    : Boolean,
	finishedBy : Date,
	author     : {
		id       : {
			type : mongoose.Schema.Types.ObjectId,
			ref  : 'User'
		},
		username : String
	}
});
module.exports = mongoose.model('Todo', todoSchema);
