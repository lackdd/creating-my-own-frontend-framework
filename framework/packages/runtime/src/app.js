import {destroyDom} from './destroy-dom.js'
import {mountDom} from './mount-dom.js'
import { h } from './h'
import { NoopRouter } from './router'

export function createApp(RootComponent, props = {}, options = {}) {
    let parentEl = null
    let isMounted = false
    let vdom = null

    const context = {
        router: options.router || new NoopRouter(),
    }

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
            mountDom(vdom, parentEl, null, { appContext: context })

            context.router.init()

            isMounted = true
        },

        unmount() {
            if (!isMounted) {
                throw new Error('The application is not mounted')
            }

            destroyDom(vdom)
            context.router.destroy()
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
