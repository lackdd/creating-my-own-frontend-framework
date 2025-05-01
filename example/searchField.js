import {defineComponent} from "../framework/packages/runtime/src/component.js";
import {h} from '../framework/packages/runtime/src/h.js'

function debounce(fn, timeout = 500) {
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
		return h(
			'input', {on: {change: debounce(this.fn)}}, ['search']
		)
	}
})

function fn() {console.log("Typed")}

const searchField = new SearchField({fn});

searchField.mount(document.body);

/*
1. kontrolli, kas poole sekundi sees on user kirjutanud veel mingi tähe
2. kui on, siis ära saada event
3. kui ei ole, siis saada event

 */
