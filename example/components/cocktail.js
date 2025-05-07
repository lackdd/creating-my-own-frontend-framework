import {defineComponent, h, hFragment} from 'dotjs/src';

export const Cocktail = defineComponent({
	state() {

	},
	render() {
		return hFragment([
			h('p', {}, ['cocktails']),
			h('button', {on: { click: () => {
						this.props.router.navigateTo('/')
					}}}, ['Go to todo page']),
			]
		)
	}
})