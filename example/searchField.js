import {defineComponent} from 'dotjs/src/component';
import {h} from 'dotjs/src/h'

function debounce(fn, timeout = 500) {
	console.log("fn:", fn)
	let timer;
	return (...args) => {
		if (!timer) {
			fn.apply(this, args);
		}
		clearTimeout(timer);
		timer = setTimeout(() => {
			timer = undefined;
		}, timeout)
	}
}

const SearchField = defineComponent({
	render() {
		// return h(
		// 	'input', {on: {input: debounce(this.props.fn)}}, ['search']
		// )
		return h(
			'input', {on: {input: debounce((event) => this.emit('search', event.target.value), 500)}}
		)
	}
})

const ParentComponent = defineComponent({
	render() {
		return h(
			'div', {}, [
				h(SearchField, {}, {
					search: (value) => console.log("search term", value)
				})]
		);
	}
});

// const fn = () => {console.log("Typed")}

const parentComponent = new ParentComponent();
/*const searchField = new SearchField({}, {
	search: (value) => console.log("Search term:", value)
});*/
parentComponent.mount(document.body);
