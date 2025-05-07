import {h, hFragment} from 'dotjs/src/h.js'
import {defineComponent} from 'dotjs/src/component.js'
import {dotjs} from 'dotjs/src/http-client';

const Cocktail = defineComponent({
        state() {
            return {
            }
        },

        render() {
            if (this.state.isLoading) {
                return h('p', {}, ['Loading...'])
            }

            if (this.state.error) {
                return h('p', {}, [`Oops: ${this.state.error}`])
            }

            return hFragment([
                h(
                    'h1', {}, [`Cocktail name: ${this.state.data ? this.state.data.drinks[0].strDrink : ""}`],
                ),
                h(
                    'p', {style: {width: '70%', height: '100px'}}, [`Preparation instructions: ${this.state.data ? this.state.data.drinks[0].strInstructions : ""}`],
                ),
                h(
                    'img', {src: `${this.state.data ? this.state.data.drinks[0].strDrinkThumb : ""}`, style: {width: '300px', height: '300px', padding: '2rem'}}, [],
                ),
                h(
                    'button', {on: { click: this.loadMore }}, ['Get another cocktail'],
                ),
            ]
            )
        },
        async loadMore() {
            await dotjs.get(`https://www.thecocktaildb.com/api/json/v1/1/random.php`, cocktail, {})
        },
    }
)

const cocktail = new Cocktail();

cocktail.mount(document.body);
