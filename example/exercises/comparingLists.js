import {h} from 'dotjs/src/h'
import {mountDom, patchDom} from "dotjs/src";

const before = h('ul', {}, [
    h('li', {}, ['Item 1']),
    h('li', {}, ['Item 2']),
    h('li', {}, [
        h('div', {}, [
            h('div', {}, [
                h('div', {}, [
                    h('p', {}, ['Item 3']),
                ]),
            ]),
        ]),
    ]),
])

mountDom(before, document.body)

const after = h('ul', {}, [
    h('li', {}, ['Item 1']),
    h('li', {}, [
        h('div', {}, [
            h('div', {}, [
                h('div', {}, [
                    h('p', {}, ['Item 3']),
                ]),
            ]),
        ]),
    ]),
    h('li', {}, ['Item 2']),
])

patchDom(before, after, document.body)
