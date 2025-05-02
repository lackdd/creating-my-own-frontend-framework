import {createApp} from '../framework/packages/runtime/src/app.js'
import {h, hFragment} from '../framework/packages/runtime/src/h.js'
import {defineComponent} from 'dotjs/src';

const TODOapp = defineComponent({
	state() {
		return {
			currentTodo: "",
			todos: [
				{ id: crypto.randomUUID(), text: 'Walk the dog' },
				{ id: crypto.randomUUID(), text: 'Water the plants' },
				{ id: crypto.randomUUID(), text: 'Sand the chairs' },
				]
		};
	},

	render() {
		const { todos, currentTodo } = this.state;
		return hFragment([
			h('h1', {style: {display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}, ['MY TODOS']),
			h(CreateTODO, {
				currentTodo,
				on: {
					update: this.updateCurrentTodo,
					add: this.addTodo
				}
			}),
			h(TodoList, {
				todos,
				on: {
					remove: this.removeTodo,
					edit: this.editTodo
				}
			})
		])
	},

	updateCurrentTodo(value) {
		this.updateState({ currentTodo: value });
	},

	addTodo(text) {
		const todo = { id: crypto.randomUUID(), text};
		this.updateState({ todos: [...this.state.todos, todo]})
		},

	removeTodo(index) {
		const { todos } = this.state;
		this.updateState({
			todos: todos.filter((_, _index) => _index !== index),
		})
	},

	editTodo({ edited, index}) {
		const newTodos = [...this.state.todos];
		newTodos[index] = {...newTodos[index], text: edited }
		this.updateState({ todos: newTodos})
	},
})

const CreateTODO = defineComponent({
	state() {
		return {
			text: ""
		}
	},

	render() {
		const {text} = this.state

		return h('div', {style: {display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}, [
			h('label', {for: 'todo-input'}, ['New TODO']),
			h('input', {
				type: 'text',
				id: 'todo-input',
				autocomplete: "off",
				value: text,
				on: {
					input: ({target}) => {
						// this.updateState({currentTodo: + target.value})
						// this.emit('update-current-todo', target.value)
						this.updateState({text: target.value})
					},
					keydown: ({key}) => {
						if (key === 'Enter' && text.length >= 3) {
							// this.emit('add-todo')
							this.addToDo();
						}
					},
				},
			}),
			h(
				'button',
				{
					disabled: text.length < 3,
					on: {click: () => this.addToDo()},
				},
				['Add']
			),
		])
	},

	addToDo() {
		this.emit('add', this.state.text)
		this.updateState({text: ''})
	}
})


const TodoList = defineComponent({
	state() {
	},

	render() {
		const {todos} = this.props
		return h('ul',
			{style: {display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}},
			todos.map((todo, index) => h(TodoItem, {
				key: todo.id,
				todo: todo.text,
				index,
				on: {
					remove: (index) => this.emit('remove', index),
					edit: ({ edited, index}) => this.emit('edit', { edited, index})
				}
			}))
		)
	}
})

const TodoItem = defineComponent({
	state({todo}) {
		return {
			original: todo,
			edited: todo,
			isEditing: false,
		}
	},

	render() {
		// const isEditing = edit.idx === i;
		const { original, edited, isEditing } = this.state;

		 return this.state.isEditing ? h('li', {}, [
			h('input', {
				value: edited,
				on: {
					input: ({ target }) => this.updateState({ edited: target.value })
				},
			}),
			h('button', {
				on: {
					click: (target) => {
						this.saveEdit();
					}
				}
			},
				['Save']
			),
			h('button', {
					on: {
						click: () => {
							this.cancelEdit();
						}
					}
				},
				['Cancel']
			),
		]) :
		 h('li', {}, [
			h('span', {
					on: {
						dblclick: () => {
							// this.emit('startEdit', this.props.index);
							this.updateState({isEditing: true})
						}
					}
				},
				[original]
			),
			h('button', {
					on: {
						click:  () => {
							this.emit('remove', this.props.index);
						}
					}
				},
				['Done']
			),
		])
	},

	saveEdit(value) {
		this.updateState({original: this.state.edited, isEditing: false});
		console.log("this.state.original: ", this.state.original)
		console.log("this.state.edited: ", this.state.edited)
		this.emit('edit', {edited: this.state.edited, i: this.props.index})
	},

	cancelEdit() {
		this.updateState({isEditing: false});
	}
})

createApp(TODOapp, { }).mount(document.body);
