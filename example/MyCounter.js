import {defineComponent} from '../framework/packages/runtime/src/component.js'
import {h, hFragment} from '../framework/packages/runtime/src/h.js'

const MyCounter = defineComponent({
    state() {
        return { count: 0 }
    },
    render() {
        return hFragment([
            h('button', {on: {click: () => {
                        console.log("this:", this)
                        this.updateState({count: this.state.count + 1})
                    }}}, [`Clicked ${this.state.count} times`]),
            h('button', {on: {click: () => this.emit("remove", this.props.key)}}, [`Remove`])
        ])
    }
})

const App = defineComponent({
    state() {
        return { counters: 3 }
    },
    render() {
        const { counters } = this.state

        return h(
            'div',
            {},
            Array(counters)
                .fill()
                .map((_, index) => {
                    return h(MyCounter, {
                        key: "abc",
                        on: {
                            remove: () => {
                                this.updateState({ counters: counters - 1})
                            },
                        },
                    })
                })
        )
    }
})

const app = new App()
app.mount(document.body)
