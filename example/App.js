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
			savedItems: [...this.state.savedItems, {id: crypto.randomUUID(), text: `Make cocktail: ${drinkName}`}]
		});
	},

	handleResetSavedItems() {
		this.updateState({
			savedItems: []
		});
	},

	render() {
		const saveHandler = this.handleSaveToList.bind(this);
		const resetHandler = this.handleResetSavedItems.bind(this);

		return hFragment([
			h('header', {}, [
				h('nav', {}, [])
			]),
			// h('span', {}, [`Cocktails: ${this.state.savedItems}`]),
			h('main', {}, [h(RouterOutlet, {
				saveToListHandler: saveHandler,
				savedItems: this.state.savedItems,
				resetSavedItemsHandler: resetHandler,
			})
			]),
			h('footer', {}, ["Example project for the dotjs frontend framework"]),
		]);
	}
});
