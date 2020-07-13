require('dotenv').config();
const express = require('express');
const router = express.Router();
const Todo = require('../models/todo');
const middleware = require('../middleware');
//index
router.get('/', middleware, (req, res) => {
	if (req.query.search) {
		const regex = new RegExp(
			escapeRegex(req.query.search),
			'gi'
		);
		Todo.find(
			{
				todo   : regex,
				author : {
					id       : req.user._id,
					username : req.user.username
				}
			},
			(err, allTodos) => {
				if (err) {
					req.flash('error', err.message);
					return res.redirect('/');
				} else {
					if (allTodos.length < 1) {
						req.flash(
							'error',
							'No Match Found'
						);
						return res.redirect('/');
					}
					res.render('index', {
						allTodos
					});
				}
			}
		);
	} else {
		Todo.find({}, (err, allTodos) => {
			if (err) {
				console.log(err);
			} else {
				res.render('index', {
					allTodos
				});
			}
		});
	}
});

//create
router.post('/', middleware, (req, res) => {
	const { todo } = req.body;
	Todo.create(
		{
			todo,
			author  : {
				id       : req.user._id,
				username : req.user.username
			},
			striked : false
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
	Todo.findByIdAndUpdate(req.params.id, { todo }, err => {
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
	});
});
//strike
router.put('/:id/toggleStrike', (req, res) => {
	Todo.findById(req.params.id, (err, todo) => {
		if (err) return handleError(err);
		todo.striked = !todo.striked;
		todo.save((err, updatedTodo) => {
			if (err) {
				req.flash('error', err.message);
				res.redirect('back');
			} else {
				req.flash(
					'success',
					'Succesfully, striked To do'
				);
				res.redirect('/');
			}
		});
	});
});
function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}
module.exports = router;
