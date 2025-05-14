import { removeEventListeners } from './events.js'
import {DOM_TYPES} from './h.js'
import { enqueueJob } from './scheduler'

export function destroyDom(vdom) {
    // console.log("Destroying dom");
    if (!vdom) return; // fix

    const {type} = vdom

    switch (type) {
        case DOM_TYPES.TEXT: {
            removeTextNode(vdom)
            break
        }

        case DOM_TYPES.ELEMENT: {
            removeElementNode(vdom)
            break
        }

        case DOM_TYPES.FRAGMENT: {
            removeFragmentNodes(vdom)
            break
        }

        case DOM_TYPES.COMPONENT: {
            if (vdom.component) { // Use internal check
                vdom.component.unmount()
                enqueueJob(() => vdom.component.onUnmounted())
            }
            break
            /*vdom.component.unmount()
            enqueueJob(() => vdom.component.onUnmounted())
            break*/
        }

        default: {
            throw new Error(`Can't destroy DOM of type: ${type}`)
        }
    }

    delete vdom.el
}

function removeTextNode(vdom) {
    const {el} = vdom
    el.remove()
}

function removeElementNode(vdom) {
    const {el, children, listeners} = vdom
    el.remove()
    children.forEach(destroyDom)

    if(listeners) {
        removeEventListeners(listeners, el)
        delete vdom.listeners
    }
}

function removeFragmentNodes(vdom) {
    const {children} = vdom
    children.forEach(destroyDom)
}
