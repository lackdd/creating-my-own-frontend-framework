import {defineComponent, h, hFragment} from 'dotjs/src';
import {dotjs} from "dotjs/src/http-client";

export const Cocktail = defineComponent({
	state() {
		return {
			isLoading: true,
		}
	},
	render() {

		if (this.state.isLoading) {
			return h('p', {}, ['Loading...'])
		}

		if (this.state.error) {
			return h('p', {}, [`Oops: ${this.state.error}`])
		}

		if (!this.state.isLoading) {
			const { strDrink, strInstructions, strDrinkThumb } = this.state.data.drinks[0];

			return hFragment([
				h('h1', {}, ['Cocktails']),
				h(
					'p', {}, [`Cocktail name: ${strDrink || ""}`],
				),
				h(
					'p', {style: {width: '70%', height: '100px'}}, [`Preparation instructions: ${strInstructions || ""}`],
				),
				h(
					'img', {src: `${strDrinkThumb || ""}`, style: {width: '300px', height: '300px', padding: '2rem'}}, [],
				),
				h(
					'button', {on: { click: this.loadMore }}, ['Get another cocktail'],
				),
				h('button', {on: { click: () => {
							this.props.router.navigateTo('/')
						}}}, ['Go to todo page']),
				// h('button', {on: {click: this.loadMore}}, ['load more cocktails']),
				h('button', {on: {click: () => this.emit('saveToList', strDrink)}}, ['Save to TODO'])
			])
		}
	},
	loadMore()  {
		dotjs.get(`https://www.thecocktaildb.com/api/json/v1/1/random.php`, this, {})
	},
	onMounted() {
		dotjs.get(`https://www.thecocktaildb.com/api/json/v1/1/random.php`, this, {});
	}
})
