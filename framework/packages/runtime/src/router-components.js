import { defineComponent } from './component'
import { h, hSlot } from './h'

export const RouterLink = defineComponent({
    render() {
        const { to } = this.props

        return h(
            'a',
            {
                href: to,
                on: {
                    click: (e) => {
                        e.preventDefault()
                        this.appContext.router.navigateTo(to)
                    },
                },
            },
            [hSlot()]
        )
    },
})

export const RouterOutlet = defineComponent({
    state() {
        return {
            matchedRoute: null,
            subscription: null,
        }
    },

    onMounted() {
        const subscription = this.appContext.router.subscribe(({ to }) => {
            this.handleRouteChange(to)
        })

        this.updateState({ subscription })
    },

    onUnmounted() {
        const { subscription } = this.state
        this.appContext.router.unsubscribe(subscription)
    },

    handleRouteChange(matchedRoute) {
        this.updateState({ matchedRoute })
    },

    render() {
        const { matchedRoute } = this.state

        return h('div', { id: 'router-outlet', style: {width: '100%', height: '100%'}}, [
            matchedRoute ? h(matchedRoute.component, {
                router: this.appContext.router
            }) : null,
        ])
    },
})