import {defineComponent} from 'dotjs/src/component.js'
import {h} from 'dotjs/src/h.js'

const ListItem = defineComponent({
	render() {
		const { item } = this.props;
		return h('li', {}, [item])
	}
})

const List = defineComponent({
	render() {
		const { items } = this.props;
		return h('ul', {id: 'list'}, items.map((item) => h(ListItem, {item} )))
		// return h('ul', {id: 'list'}, items.map((item) => h('li', {}, [item] )))
	}
})


const items = ['foo', 'bar', 'baz']
let list = new List({items})
list.mount(document.body)