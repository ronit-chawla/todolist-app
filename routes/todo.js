require('dotenv').config();
const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');
const middleware = require('../middleware');
//index
router.get('/', middleware, (req, res) => {
	Todo.find({}, (err, allTodos) => {
		if (err) {
			console.log(err);
		} else {
			res.render('index', {
				allTodos
			});
		}
	});
});

//create
router.post('/', middleware, (req, res) => {
	const { todo } = req.body;
	Todo.create(
		{
			todo,
			author : {
				id       : req.user._id,
				username : req.user.username
			}
		},
		(err, todo) => {
			if (err) {
				console.log(err);
			} else {
				req.flash(
					'success',
					'Succesfully, created todo'
				);
				res.redirect('/');
			}
		}
	);
});
//destroy
router.delete('/:id', middleware, (req, res) => {
	Todo.findByIdAndRemove(req.params.id, err => {
		if (err) {
			console.log(err);
			res.redirect('/');
		} else {
			req.flash(
				'success',
				'Succesfully, deleted To do'
			);
			res.redirect('/');
		}
	});
});
//edit
router.get('/:id/edit', middleware, async (req, res) => {
	const foundTodo = await Todo.findById(req.params.id);
	res.render('edit', {
		todo : foundTodo
	});
});
//update
router.put('/:id', (req, res) => {
	const { todo } = req.body;
	Todo.findByIdAndUpdate(
		req.params.id,
		{ todo },
		(err, updatedComment) => {
			if (err) {
				req.flash('error', err.message);
				res.redirect('back');
			} else {
				req.flash(
					'success',
					'Succesfully, updated To do'
				);
				res.redirect('/');
			}
		}
	);
});
module.exports = router;
