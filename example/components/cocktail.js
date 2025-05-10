import {defineComponent, h, hFragment} from 'dotjs/src';
import {dotjs} from "dotjs/src/http-client";
import {globalState} from '../main';

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
				hFragment([
					h('h1', {}, ['Cocktails']),
					h('p', {}, [`global state: ${globalState.getState.savedItems || []}`]),
					h(
						'p', {}, [`Cocktail name: ${strDrink || ""}`],
					),
					// h(
					// 	'p', {style: {width: '70%', height: '100px'}}, [`Preparation instructions: ${strInstructions || ""}`],
					// ),
					h(
						'img', {src: `${strDrinkThumb || ""}`, style: {width: '300px', height: '300px', padding: '2rem'}}, [],
					),
					h(
						'button', {on: { click: this.loadMore }}, ['Get another cocktail'],
					),
					h('button', {on: { click: () => {
								this.props.router.navigateTo('/')
							}}}, ['Go to todo page']),
					h('button', {on: {click: () => {
								this.props.saveToListHandler(strDrink);
							}}}, ['Save to TODO']),
					h('button', {
						on: {
							click: () => {
								globalState.setState({ savedItems: [1,2, 3] });
								console.log("global state edited");
							}
						}
					}, ["Edit global state"]),
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
