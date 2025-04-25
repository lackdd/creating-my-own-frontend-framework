import { destroyDom } from './destroy-dom.js'
import { mountDom } from './mount-dom.js'

export function defineComponent({ render }) {
    class Component {
        #isMounted = false
        #vdom = null
        #hostEl = null

        constructor(props = {}) {
            this.props = props
            this.state = state ? state(props) : {}
        }

        render() {
            return render()
        }

        mount(hostEl, index = null) {
            if (this.#isMounted) {
                throw new Error('Component is already mounted')
            }

            this.#vdom = this.render()
            mountDom(this.#vdom, hostEl, index)
            this.#hostEl = hostEl
            this.#isMounted = true
        }

        unmount() {
            if (!this.#isMounted) {
                throw new Error('Component is not mounted')
            }

            destroyDom(this.#vdom)

            this.#vdom = null
            this.#hostEl = null
            this.#isMounted = false
        }
    }

    return Component
}
