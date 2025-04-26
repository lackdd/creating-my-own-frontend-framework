import {createApp} from '../framework/packages/runtime/src/app.js'
import {h} from '../framework/packages/runtime/src/h.js'
import {defineComponent} from '../framework/packages/runtime/src/component.js'

function getRandomInt() {
	return Math.floor(Math.random() * 100);
}

const FlyingButton = defineComponent({
	state() {
		return {
			top: getRandomInt() + '%',
			left: getRandomInt() + '%'
		}
	},

	render() {
		const { top, left } = this.state;

		return h('button',
			{style: {position: 'absolute', top: top, left: left},
				on: {
					click: () => {
						this.updateState({
							top: getRandomInt() + '%',
							left: getRandomInt() + '%',
						})
					},
				},
			},
			['Move'],
			)
	},
})

const flyingButtonInstance = new FlyingButton();

// function App() {
// 	return new FlyingButton();
// }

// createApp({view: flyingButtonInstance}).mount(document.body);

flyingButtonInstance.mount(document.body);
