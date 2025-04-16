import {mountDom} from '/framework/packages/runtime/src/mount-dom.js';
import {h} from '/framework/packages/runtime/src/h.js'

function main() {
	console.log('Starting app!')

	const vdom = h('section', {}, [
		h('h1', {}, ['My blog']),
			h('p', {}, ['Welcome to my blog!'])
		])

	return mountDom(vdom, document.body)
}

main();


// import {h, hFragment} from 'dotjs/src/h';
//
// // Exercise 3.2
// hFragment([
// 	h('h1', { class: 'title'}, ['My Counter']),
// 	h('div', { class: 'container'}, [
// 		h('button', {}, ['decrement']),
// 		h('span', {}, ['0']),
// 		h('button', {}, ['increment']),
// 	])
// ])
//
// // Exercise 3.3
// function lipsum(num) {
// 	const list = [];
// 	for (let i = 0; i < num; i++) {
// 		list.push(h('p', {}, ['Example text spam']))
// 	}
// 	return hFragment(list)
// }
//
//
// // exercise 3.4
// function messageComponent({level, message}) {
// 	return h('div', { class: `message message--${level}`}, [
// 		h('p'), {}, [message]
// 	])
// }
