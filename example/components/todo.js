import {h, hFragment} from 'dotjs/src/h.js'
import {defineComponent} from 'dotjs/src';
import {globalState} from '../main';

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
			id: 'todos-container',
		}, [
			hFragment([
				h('h1', {style: {display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}, ['MY TODOS']),
				h('p', {}, [`global state: ${globalState.getState.savedItems || []}`]),
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
				h('button', {on: { click: () => {
					router.navigateTo('/cocktail')
					 }}}, ['Go to cocktail page']),
			]),
		])
	},

	onMounted() {
		const _todos = localStorage.getItem("todos");
		console.log("Getting todos from local storage on mount", _todos);

		if (_todos == null) {
			localStorage.setItem("todos", JSON.stringify(this.state.todos));
			console.log("Setting todos to local storage on mount", this.state.todos);
		} else {
			try {
				const parsedTodos = JSON.parse(_todos);
				console.log("Updating todos from local storage", parsedTodos);
				this.updateState({ todos: parsedTodos });
			} catch (e) {
				console.warn("Failed to parse todos from localStorage", e);
			}
		}
	},

	onUnMounted() {
		localStorage.setItem("todos", JSON.stringify(this.state.todos));
		console.log("Setting todos to local storage on unmount", this.state.todos);
	},

	updateCurrentTodo(value) {
		this.updateState({ currentTodo: value });
	},

	onPatched() {
		if (Array.isArray(this.state.todos)) {
			localStorage.setItem("todos", JSON.stringify(this.state.todos));
			console.log("Saved todos to local storage after patch", this.state.todos);
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
		// localStorage.setItem("todos", JSON.stringify(this.state.todos));
	},

	editTodo({ edited, index}) {
		const newTodos = [...this.state.todos];
		newTodos[index] = {...newTodos[index], text: edited };
		this.updateState({todos: newTodos});
		console.log("index: ", index)
		// localStorage.setItem("todos", JSON.stringify(this.state.todos));
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
				style: {
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center'
				}
			}, [
				h('label',
					{ for: 'todo-input',
					style: {textAlign: 'left', width: '90%'}},
					['New TODO']),
			]),
			h('div', {
				style: {
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'center'
				}
			}, [
				h('input', {
					type: 'text',
					id: 'todo-input',
					autocomplete: "off",
					value: text,
					style: {width: '70%'},
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
					style: {marginLeft: 'auto'},
					on: { click: () => this.addToDo() },
				}, ['Add']),
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
		console.log("todos in TodoList: ", todos)
		return h('ul',
			{style: {display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', padding: '0'}},
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

		 return isEditing ? h('li', {}, [
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
		 h('li', {style: {width: '100%', display: 'flex', flex: '1', justifyContent: 'space-between', padding: '0.2rem'}}, [
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
				style: {
				}
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
