import {h, hFragment} from '../framework/packages/runtime/src/h.js'
import {defineComponent} from '../framework/packages/runtime/src/component.js'

const fetchItems = async() => {
    const response = await fetch('https://www.thecocktaildb.com/api/json/v1/1/random.php');
    const data = await response.json();
    return data.drinks[0];
}

const Cocktail = defineComponent({
        state() {
            return {
                cocktailName: "",
                instructions: "",
                imageURL: "",
                isLoading: false,
            }
        },

        render() {
            const { cocktailName, instructions, imageURL, isLoading } = this.state

            // if (isLoading) {
            //     return h('p', {}, ['Loading...'])
            // }

            return hFragment([
                h(
                    'h1', {}, [`Cocktail name: ${cocktailName}`],
                ),
                h(
                    'p', {}, [`Preparation instructions: ${instructions}`],
                ),
                h(
                    'img', {src: imageURL}, [],
                ),
                h(
                    'button', {on: { click: this.loadMore }}, ['Get another cocktail'],
                ),

                // isLoading
                //     ? h('p', {}, ['Loading...'])
                //     : h(
                //         'button',
                //         {
                //             on: { click: this.loadMore }
                //         },
                //         ['Get a cocktail'],
                //     ),
                ]

            )
        },
        async loadMore() {
            this.updateState({cocktailName: "", instructions: "", imageURL: "", isLoading: true})

            const {strDrink, strInstructions, strDrinkThumb} = await fetchItems();

            this.updateState({
                cocktailName: strDrink,
                instructions: strInstructions,
                imageURL: strDrinkThumb,
                isLoading: false,
            })
        },
    }
)

const cocktail = new Cocktail();

cocktail.mount(document.body);
