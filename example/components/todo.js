import {h, hFragment, hSlot} from 'dotjs/src/h.js';
import {defineComponent} from 'dotjs/src';

export const TODOapp = defineComponent({
	state() {
		return {
			currentTodo: "",
			todos: [
				{ id: crypto.randomUUID(), text: 'Walk the dog' },
				{ id: crypto.randomUUID(), text: 'Water the plants' },
				{ id: crypto.randomUUID(), text: 'Sand the chairs' },
				],
		};
	},

	render() {
		const { todos, currentTodo } = this.state;
		const router = this.props.router

		return h('div', {
			id: 'todo-container',
		}, [
			hFragment([
				h('h1', {}, ['MY TODOS']),
				// h('p', {}, [`global state: ${globalState.getState.savedItems || []}`]),
				// h('p', {}, [`savedItems from props: ${this.props.savedItems || []}`]),
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
				}),
				// h('button', {on: { click: () => {
				// 	router.navigateTo('/cocktail')
				// 	 }}}, ['Go to cocktail page']),
			]),
		])
	},

	onMounted() {
		const _todos = localStorage.getItem("todos");

		console.log("this.state.todos: ", this.state.todos);
		console.log("this.props.savedItems: ", this.props.savedItems);

		if (_todos == null) {
			// localStorage.setItem("todos", JSON.stringify(this.state.todos));
			console.log("todos null in localStorage");
		} else {
			try {
				const parsedTodos = JSON.parse(_todos);
				this.updateState({ todos: parsedTodos });
			} catch (e) {
				console.warn("Failed to parse todos from localStorage", e);
			}
		}
		this.updateState({ todos: [...this.state.todos, ...this.props.savedItems] });
		this.props.resetSavedItemsHandler();

	},

	onUnmounted() {
		localStorage.setItem("todos", JSON.stringify(this.state.todos));
	},

	updateCurrentTodo(value) {
		this.updateState({ currentTodo: value });
	},

	onPatched() {
		if (Array.isArray(this.state.todos)) {
			localStorage.setItem("todos", JSON.stringify(this.state.todos));
		} else {
			console.warn("State.todos is not an array. Skipping localStorage save.");
		}
	},

	addTodo(text) {
		const todo = { id: crypto.randomUUID(), text};
		this.updateState({ todos: [...this.state.todos, todo]})
		// localStorage.setItem("todos", JSON.stringify(this.state.todos));
		},

	removeTodo(index) {
		const { todos } = this.state;
		this.updateState({
			todos: todos.filter((_, _index) => _index !== index),
		})
	},

	editTodo({ edited, index}) {
		const newTodos = [...this.state.todos];
		newTodos[index] = {...newTodos[index], text: edited };
		this.updateState({todos: newTodos});
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

		return hFragment([
			h('div', {
				className: 'label-container'
			}, [
				h('label',
					{ for: 'todo-input'},
					['New TODO']),
			]),
			h('div', {className: 'input-container'}, [
				h('div', {
					className: 'extra-input-container'
				}, [
					h('input', {
						type: 'text',
						id: 'todo-input',
						autocomplete: "off",
						value: text,
						on: {
							input: ({ target }) => {
								this.updateState({ text: target.value });
							},
							keydown: ({ key }) => {
								if (key === 'Enter' && text.length >= 3) {
									this.addToDo();
								}
							},
						},
					}),
					h('button', {
						disabled: text.length < 3,
						className: 'todo-button add',
						on: { click: () => this.addToDo() },
					}, ['Add']),
				])
			])
		]);
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
		// console.log("todos in TodoList: ", todos)
		return h('ul',
			{className: 'todo-list'},
			todos.map((todo, index) => h(TodoItem, {
				key: todo.id,
				todo: todo.text,
				index,
				on: {
					remove: (index) => this.emit('remove', index),
					edit: ({ edited, index}) => this.emit('edit', { edited, index})
				}
			}, [ h('span', {style: {display: 'none'}}, [`[${index + 1}]`])]
			))
		)
	},
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
		const { original, edited, isEditing } = this.state;

		 return isEditing ? h('li', {className: 'todo-item'}, [
			 hSlot(),
			h('input', {
				value: edited,
				on: {
					input: ({ target }) => this.updateState({ edited: target.value })
				},
			}),
			 h('div', {className: 'todo-buttons'}, [
				 hFragment([
					 h('button', {
							 on: {
								 click: (target) => {
									 this.saveEdit();
								 }
							 },
							 className: 'todo-button'
						 },
						 ['Save']
					 ),
					 h('button', {
							 on: {
								 click: () => {
									 this.cancelEdit();
								 }
							 },
							 className: 'todo-button'
						 },
						 ['Cancel']
					 ),
				 ])
			 ])
		]) :
		 h('li', {className: 'todo-item',}, [
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
					}},
					className: 'todo-button'
				},
				['Done']
			),
		])
	},

	saveEdit(value) {
		this.updateState({original: this.state.edited, isEditing: false});
		this.emit('edit', {edited: this.state.edited, index: this.props.index})
	},

	cancelEdit() {
		this.updateState({isEditing: false});
	}
})
