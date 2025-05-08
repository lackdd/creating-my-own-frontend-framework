// example/App.js
import { defineComponent, h, hFragment, RouterOutlet } from 'dotjs/src';

export const App = defineComponent({
	state() {
		return {
			savedItems: []
		}},

	handleSaveToList(drinkName) {
		console.log("Saving to list: ", drinkName);
		this.updateState({
			savedItems: [...this.state.savedItems, drinkName]
		});
	},

	render() {
		return hFragment([
			h('header', {}, ["header"]),
			h('span', {}, [`Cocktails: ${this.state.savedItems}`]),
			h('main', {style: {width: '30%'}}, [h(RouterOutlet, {
				saveToListHandler: saveHandler,
				savedItems: this.state.savedItems
			})
			]),
			h('footer', {}, ["footer"]),
		]);
	}
});
