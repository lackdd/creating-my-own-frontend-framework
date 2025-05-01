import {destroyDom} from './destroy-dom.js'
import {mountDom} from './mount-dom.js'
import { h } from './h'

export function createApp(RootComponent, props = {}) {
    let parentEl = null
    let isMounted = false
    let vdom = null

    function reset() {
        parentEl = null
        isMounted = false
        vdom = null
    }

    return {
        mount(_parentEl) {
            if (isMounted) {
                throw new Error('The application is already mounted')
            }

            parentEl = _parentEl
            vdom = h(RootComponent, props)
            mountDom(vdom, parentEl)

            isMounted = true
        },

        unmount() {
            if (!isMounted) {
                throw new Error('The application is not mounted')
            }

            destroyDom(vdom)
            reset()
        },
    }

    /*let parentEl = null
    let vdom = null
    let isMounted = false;

    const dispatcher = new Dispatcher()
    const subscriptions = [dispatcher.afterEveryCommand(renderApp)]

    function emit(eventName, payload) {
        dispatcher.dispatch(eventName, payload)
    }

    for (const actionName in reducers) {
        const reducer = reducers[actionName]

        const subs = dispatcher.subscribe(actionName, (payload) => {
            state = reducer(state, payload)
        })
        subscriptions.push(subs)
    }

    function renderApp() {
        // if (vdom) {
        //     destroyDom(vdom)
        // }

        // vdom = view(state, emit)
        // mountDom(vdom, parentEl)

        const newVdom = view(state, emit);
        vdom = patchDom(vdom, newVdom, parentEl);
    }

    return {
        mount (_parentEl) {
            if (isMounted) {
                throw new Error('Cannot mount more than once')
            }

            parentEl = _parentEl
            vdom = view(state, emit);
            mountDom(vdom, parentEl);
            isMounted = true;
        },

        unmount() {
            destroyDom(vdom)
            vdom = null
            subscriptions.forEach((unsubscribe) => unsubscribe())
            isMounted = false;
        },
    }*/
}
