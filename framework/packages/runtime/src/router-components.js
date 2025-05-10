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
        const { matchedRoute } = this.state;

        const { router, ...otherProps } = this.props;

        const routeComponentProps = {
            router: this.appContext.router,
            ...otherProps
        };

        return h('div', { id: 'router-outlet', style: {width: '100vw', height: '100vh'}}, [
            matchedRoute ? h(matchedRoute.component, routeComponentProps) : null,
        ]);
    }
})