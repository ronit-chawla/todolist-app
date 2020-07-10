const mongoose = require('mongoose');
const Todo = require('./models/todo');

const seeds = [
	{ todo: 'todo app' },
	{ todo: 'color app' }
];
const seedDB = async () => {
	try {
		await Todo.deleteMany({});
		for (const seed of seeds) {
			let todo = await Todo.create(seed);
			todo.save();
		}
	} catch (err) {
		console.log(err);
	}
};
module.exports = seedDB;
