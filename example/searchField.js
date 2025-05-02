import {defineComponent} from 'dotjs/src/component';
import {h} from 'dotjs/src/h'

function debounce(fn, timeout = 500, context = null) {
	let timer;
	return (...args) => {
		if (!timer) {
			fn.apply(context, args); // bind to the provided context
		}
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = undefined;
		}, timeout);
	};
}

const SearchField = defineComponent({
	render() {
		// Pass `this` to `debounce` so it can access the parent component
		return h(
			'input',
			{
				on: {
					input: debounce( (event) => {
						// Inside this function, `this` refers to the parent component
						console.log("this: ", this.props.parent);
						this.props.parent.emit('search', event.target.value);
					}, 500, this.props.parent)
				}
			}
		);
	}
});

const ParentComponent = defineComponent({
	render() {
		// const searchField = new SearchField({}, {}, this);
		return h('div', {}, [h(SearchField, {parent: this})]);
	}
})

// const fn = () => {console.log("Typed")}

const parentComponent = new ParentComponent({}, {search: (value) => console.log("searching:", value)});

parentComponent.mount(document.body);
