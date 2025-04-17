import {createApp, h, hFragment} from 'framework/packages/runtime/src'

function App(state, emit) {
	return hFragment([
		h('h1', {}, ['MY TODOS']),
		CreateTodo(state, emit),
		TodoList(state, emit),
	])
}

function CreateTodo({ currentTodo }, emit) {
	return h('div', {}, [
		h('label', {for: 'todo-input'}, ['New TODO']),
		h('input', {
			type: 'text',
			id: 'todo-input',
			value: state.currentTodo,
			on: {
				input: ({target}) =>
					emit('update-current-todo', target.value),
				keydown: ({key}) => {
					if (key === 'Enter' && currentTodo.length >= 3) {
						emit('add-todo')
					}
				},
			},
		}),
		h(
			'button',
			{
				disabled: currentTodo.length < 3,
				on: {click: () => emit('add-todo')},
			},
		['Add']
		),
	])
}

const state = {
	currentTodo: '',
	edit: {
		idx: null,
		original: null,
		edited: null,
	},
	todos: ['Walk the dog', 'Water the plants'],
}

const reducers = {
	'update-current-todo': (state, currentTodo) => ({
		...state,
		currentTodo,
	}),

	'add-todo': (state) => ({
		...state,
		currentTodo: '',
		todos: [...state.todos, state.currentTodo],
	}),

	'start-editing-todo': (state, idx) => ({
		...state,
		edit: {
			idx,
			original: state.todos[idx],
			edited: state.todos[idx],
		},
	}),

	'edit-todo': (state, edited) => ({
		...state,
		edit: { ...state.edit, edited },
	}),

	'save-edited-todo': (state) => {
		const todos = [...state.todos]
		todos[state.edit.idx] = state.edit.edited

		return {
			...state,
			edit: { idx: null, original: null, edited: null },
			todos,
		}
	},

	'cancel-editing-todo': (state) => ({
		...state,
		edit: { idx: null, original: null, edited: null },
	}),

	'remove-todo': (state, idx) => ({
		...state,
		todos: state.todos.filter((_, i) => i !== idx),
	}),
}

/*todos—The array of to-do items (same as before)
 currentTodo—The text of the new to-do item that the user is typing in the
input field
 edit—An object containing information about the to-do item being edited by
the user:
	– idx—The index of the to-do item in the todos array that’s being edited
– original—The original text of the to-do item before the user started editing it
(in case the edition is canceled and you need to bring back the original value)
– edited—The text of the to-do item as the user is editing it*/
