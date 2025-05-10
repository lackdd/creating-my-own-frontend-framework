import {defineComponent, h, hFragment} from 'dotjs/src';
import {dotjs} from "dotjs/src/http-client";
import {globalState} from '../global.js';

export const Cocktail = defineComponent({
	state() {
		return {
			isLoading: true,
		}
	},
	render() {

		if (this.state.isLoading) {
			return h('p', {className: 'loading'}, ['Loading...'])
		}

		if (this.state.error) {
			return h('p', {}, [`Oops: ${this.state.error}`])
		}

		if (!this.state.isLoading) {
			const { strDrink, strInstructions, strDrinkThumb } = this.state.data.drinks[0];

			return h('div', {id: 'cocktails-container'}, [
				h('div', {className: 'cocktail'}, [
					h('h1', {}, ['Cocktails']),
					hFragment([
						// h('p', {}, [`global state: ${globalState.getState.savedItems || []}`]),
						h(
							'p', {className: 'cocktail-name'}, [`${strDrink || ""}`],
						),
						// h(
						// 	'p', {style: {width: '70%', height: '100px'}}, [`Preparation instructions: ${strInstructions || ""}`],
						// ),
						h(
							'img', {src: `${strDrinkThumb || ""}`}, [],
						),
						h('div', {className: 'cocktail-buttons'}, [
							hFragment([
								h(
									'button', {on: { click: this.loadMore }}, ['Get new cocktail'],
								),
								h('button', {on: {click: () => {
											this.props.saveToListHandler(strDrink);
										}}}, ['Add to TODO']),
							])
						])
					])
				])
			])


		}
	},
	loadMore()  {
		dotjs.get(`https://www.thecocktaildb.com/api/json/v1/1/random.php`, this, {});
	},
	async onMounted() {

		this.subscribeTo(globalState, (newGlobalState) => {
			// this.updateState({ global: { ...newGlobalState } }); // again, fresh object
			this.updateState({});
		});

		await dotjs.get(`https://www.thecocktaildb.com/api/json/v1/1/random.php`, this, {});

		// this.updateState({isLoading: true});
	},
})
