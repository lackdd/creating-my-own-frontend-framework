import { destroyDom } from './destroy-dom.js'
import { mountDom } from './mount-dom.js'
import { patchDom } from './patch-dom.js';
import {DOM_TYPES, extractChildren} from './h';

export function defineComponent({ render, state }) {
    class Component {
        #isMounted = false
        #vdom = null
        #hostEl = null

        constructor(props = {}) {
            this.props = props
            this.state = state ? state(props) : {}
        }

        get elements() {
            if (this.#vdom == null) {
                return []
            }
            if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
                return extractChildren(this.#vdom).map((child) => child.el)
            }

            return [this.#vdom.el]
        }

        get firstElement() {
            return this.elements[0]
        }

        get offset() {
         if (this.#vdom.type === DOM_TYPES.FRAGMENT) {
             return Array.from(this.#hostEl.children).indexOf(this.firstElement)
         }
         return 0
        }

        updateState(state) {
            this.state = { ...this.state, ...state};
            this.#patch();
        }

        render() {
            return render.call(this)
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

        #patch() {
            if (!this.#isMounted) {
                throw new Error('Component is not mounted');
            }

            const vdom = this.render()
            this.#vdom = patchDom(this.#vdom, vdom, this.#hostEl, this)
        }
    }

    return Component
}
