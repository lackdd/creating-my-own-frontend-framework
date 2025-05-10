# dot-js Frontend Framework
This framework was created based on a book named "Build a Frontend Web Framework (From Scratch)" by Angel Sola Orbaiceta 

dot-js is a lightweight, reactive frontend framework built from scratch using vanilla JavaScript. It provides component-based architecture, reactive state management, virtual DOM implementation, and client-side routing capabilities.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Installation](#installation)
4. [Getting Started](#getting-started)
5. [Creating Components](#creating-components)
6. [State Management](#state-management)
7. [Virtual DOM](#virtual-dom)
8. [Event Handling](#event-handling)
9. [Routing](#routing)
10. [HTTP Client](#http-client)
11. [Slots](#slots)
12. [Lifecycle Hooks](#lifecycle-hooks)
13. [Best Practices](#best-practices)
14. [API Reference](#api-reference)

## Overview

dot-js is designed to be simple yet powerful, providing essential frontend framework features without the bloat. Key features include:

- **Component-based Architecture**: Build reusable UI components
- **Reactive State Management**: Efficient state updates with virtual DOM diffing
- **Built-in Router**: Client-side routing with hash-based navigation
- **Event System**: Flexible event handling with delegation support
- **HTTP Client**: Simple API for making HTTP requests
- **Slots**: Content projection similar to Vue's slot system
- **Lifecycle Hooks**: onMounted, onUnmounted, and onPatched hooks

## Architecture

The framework consists of several core modules:

- **Virtual DOM Engine**: Efficient DOM updates through virtual DOM diffing
- **Component System**: Class-based components with reactive state
- **Router**: Hash-based routing with route guards
- **Event System**: Centralized event handling with dispatcher
- **Scheduler**: Micro-task based job scheduling for performance
- **HTTP Client**: Built-in AJAX functionality with state management

```
dot-js/
├── app.js              # Application entry point
├── component.js        # Component definition system
├── h.js                # Virtual DOM node creation
├── mount-dom.js        # DOM mounting logic
├── patch-dom.js        # DOM diffing and patching
├── destroy-dom.js      # DOM cleanup
├── router.js           # Routing implementation
├── dispatcher.js       # Event dispatcher
├── scheduler.js        # Job scheduling
├── http-client.js      # HTTP utilities
└── utils/             # Utility functions
```

## Installation

Clone the repository and import the framework:

```javascript
import * as runtime from "framework/packages/runtime/src/index.js";
```
Optionally import specific parts of the framework from the same diretory:

```javascript
import {
  createApp,
  defineComponent,
  DOM_TYPES,
  h,
  hFragment,
  hSlot,
  hString,
  RouterLink,
  RouterOutlet,
  HashRouter,
  nextTick,
  GlobalState
} from "framework/packages/runtime/src/index.js";
```

## Running the example

Run these commands in the root directory:

```bash
npm install
```

```bash
npm run dev
```

## Getting Started

Create a simple application:

```javascript
// main.js
import { createApp, defineComponent, h } from './dot-js/index.js';

// Define a root component
const App = defineComponent({
  state() {
    return {
      message: 'Hello, dot-js!'
    };
  },
  
  render() {
    return h('div', {}, [
      h('h1', {}, [this.state.message])
    ]);
  }
});

// Create and mount the application
const app = createApp(App);
app.mount(document.getElementById('app'));
```

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
  <title>dot-js App</title>
</head>
<body>
  <div id="app"></div>
  <script type="module" src="main.js"></script>
</body>
</html>
```

## Creating Components

Components are defined using the `defineComponent` function:

```javascript
const Counter = defineComponent({
  state(props) {
    return {
      count: props.initialCount || 0
    };
  },
  
  onMounted() {
    console.log('Counter mounted');
  },
  
  increment() {
    this.updateState({ count: this.state.count + 1 });
  },
  
  render() {
    return h('div', {}, [
      h('p', {}, [`Count: ${this.state.count}`]),
      h('button', {
        on: {
          click: () => this.increment()
        }
      }, ['Increment'])
    ]);
  }
});
```

### Component Props

Components receive props through their constructor:

```javascript
// Parent component
const Parent = defineComponent({
  render() {
    return h(Counter, { initialCount: 10 });
  }
});
```

### Component Methods

Define custom methods directly in the component definition:

```javascript
const TodoList = defineComponent({
  state() {
    return {
      todos: [],
      newTodo: ''
    };
  },
  
  addTodo() {
    if (this.state.newTodo.trim()) {
      this.updateState({
        todos: [...this.state.todos, this.state.newTodo],
        newTodo: ''
      });
    }
  },
  
  removeTodo(index) {
    const todos = [...this.state.todos];
    todos.splice(index, 1);
    this.updateState({ todos });
  },
  
  render() {
    // ... render logic
  }
});
```

## State Management

### Local Component State

Each component manages its own state:

```javascript
const StatefulComponent = defineComponent({
  state(props) {
    return {
      data: props.data || [],
      loading: false,
      error: null
    };
  },
  
  updateState(newState) {
    // Merges new state with existing state
    this.updateState(newState);
  },
  
  render() {
    const { data, loading, error } = this.state;
    
    if (loading) return h('div', {}, ['Loading...']);
    if (error) return h('div', {}, [`Error: ${error}`]);
    
    return h('div', {}, data.map(item => 
      h('p', {}, [item])
    ));
  }
});
```

### Global State Management

For global state, use the `GlobalState` class:

```javascript
import { GlobalState } from './dot-js/global-state.js';

// Create global store
const store = new GlobalState({
  user: null,
  theme: 'light'
});

// Component that subscribes to global state
const UserInfo = defineComponent({
  onMounted() {
    this.subscribeTo(store, (state) => {
      this.updateState({ user: state.user });
    });
  },
  
  render() {
    return h('div', {}, [
      h('p', {}, [`User: ${this.state.user?.name || 'Not logged in'}`])
    ]);
  }
});
```

## Virtual DOM

The virtual DOM system efficiently updates the real DOM:

### Creating Virtual Nodes

```javascript
// Element node
const div = h('div', { 
  class: 'container',
  style: { color: 'blue' }
}, [
  h('h1', {}, ['Title']),
  h('p', {}, ['Content'])
]);

// Component node
const component = h(MyComponent, { prop1: 'value' });

// Fragment node
import { hFragment } from './dot-js/index.js';
const fragment = hFragment([
  h('li', {}, ['Item 1']),
  h('li', {}, ['Item 2'])
]);

// Text node
import { hString } from './dot-js/index.js';
const text = hString('Hello World');
```

### Element Attributes

```javascript
const element = h('input', {
  type: 'text',
  placeholder: 'Enter text',
  value: this.state.inputValue,
  class: ['form-control', 'primary'],
  style: {
    fontSize: '16px',
    padding: '8px'
  },
  on: {
    input: (e) => this.handleInput(e)
  }
});
```

## Event Handling

Events are handled using the `on` prop:

```javascript
const Button = defineComponent({
  handleClick(event) {
    event.preventDefault();
    console.log('Button clicked');
  },
  
  render() {
    return h('button', {
      on: {
        click: this.handleClick,
        mouseenter: () => console.log('Mouse entered'),
        mouseleave: () => console.log('Mouse left')
      }
    }, ['Click Me']);
  }
});
```

### Event Emission

Components can emit custom events:

```javascript
const ChildComponent = defineComponent({
  notifyParent() {
    this.emit('custom-event', { message: 'Hello from child' });
  },
  
  render() {
    return h('button', {
      on: { click: this.notifyParent }
    }, ['Notify Parent']);
  }
});

const ParentComponent = defineComponent({
  handleCustomEvent(payload) {
    console.log('Received:', payload.message);
  },
  
  render() {
    return h(ChildComponent, {
      on: {
        'custom-event': this.handleCustomEvent
      }
    });
  }
});
```

## Routing

Hash-based routing with support for parameters and guards:

```javascript
import { HashRouter } from './dot-js/index.js';
import Home from './components/Home.js';
import About from './components/About.js';
import User from './components/User.js';

const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
  { path: '/user/:id', component: User },
  { path: '*', redirect: '/' } // Catch-all route
];

const router = new HashRouter(routes);

// Create app with router
const app = createApp(RootComponent, {}, { router });
app.mount('#app');
```

### Using RouterLink and RouterOutlet

```javascript
import { RouterLink, RouterOutlet } from './dot-js/index.js';

const App = defineComponent({
  render() {
    return h('div', {}, [
      h('nav', {}, [
        h(RouterLink, { to: '/' }, ['Home']),
        h(RouterLink, { to: '/about' }, ['About']),
        h(RouterLink, { to: '/user/123' }, ['User 123'])
      ]),
      h(RouterOutlet)
    ]);
  }
});
```

### RouterOutlet Implementation

The RouterOutlet component uses a router subscription callback to react to route changes:

```javascript
// From router-components.js
const RouterOutlet = defineComponent({
  state() {
    return {
      matchedRoute: null,
      subscription: null,
    }
  },

  onMounted() {
    // Subscribe to router changes with a callback function
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

    return h('div', { id: 'router-outlet' }, [
      matchedRoute ? h(matchedRoute.component, routeComponentProps) : null,
    ]);
  }
});
```

This callback pattern is used specifically for router event subscription, where the router dispatches navigation events with payload containing `{ from, to, router }`, and RouterOutlet uses the `to` property to render the appropriate component.


### Route Guards

Add route guards for authentication:

```javascript
const protectedRoute = {
  path: '/admin',
  component: Admin,
  beforeEnter: async (from, to) => {
    if (!userIsAuthenticated()) {
      return '/login'; // Redirect to login
    }
    return true; // Allow navigation
  }
};
```

### Accessing Route Data

```javascript
const UserComponent = defineComponent({
  onMounted() {
    // Access route parameters
    const userId = this.props.router.params.id;
    
    // Access query parameters
    const queryParams = this.props.router.query;
  },
  
  render() {
    return h('div', {}, [
      h('h1', {}, [`User ${this.props.router.params.id}`])
    ]);
  }
});
```

## HTTP Client

Built-in HTTP client with automatic state management:

```javascript
import { dotjs } from './dot-js/http-client.js';

const DataComponent = defineComponent({
  state() {
    return {
      data: null,
      loading: false,
      error: null
    };
  },
  
  async onMounted() {
    await this.fetchData();
  },
  
  async fetchData() {
    try {
      // HTTP client automatically manages loading and error states
      const data = await dotjs.get('/api/data', this);
      // Component state is automatically updated
    } catch (error) {
      // Error state is automatically set
      console.error('Failed to fetch data:', error);
    }
  },
  
  async createData() {
    const payload = { name: 'New Item' };
    await dotjs.post('/api/data', this, payload);
  },
  
  async updateData(id) {
    const payload = { name: 'Updated Item' };
    await dotjs.put(`/api/data/${id}`, this, payload);
  },
  
  async deleteData(id) {
    await dotjs.delete(`/api/data/${id}`, this);
  },
  
  render() {
    const { data, loading, error } = this.state;
    
    if (loading) return h('div', {}, ['Loading...']);
    if (error) return h('div', {}, [`Error: ${error}`]);
    if (!data) return h('div', {}, ['No data']);
    
    return h('div', {}, [
      h('pre', {}, [JSON.stringify(data, null, 2)])
    ]);
  }
});
```

## Slots

Content projection for reusable components:

```javascript
import { hSlot } from './dot-js/index.js';

const Modal = defineComponent({
  render() {
    return h('div', { class: 'modal' }, [
      h('div', { class: 'modal-header' }, [
        h('h2', {}, ['Modal Title'])
      ]),
      h('div', { class: 'modal-body' }, [
        hSlot() // Content will be projected here
      ])
    ]);
  }
});

// Using the modal with custom content
const App = defineComponent({
  render() {
    return h(Modal, {}, [
      h('p', {}, ['This content will be projected into the slot'])
    ]);
  }
});
```

### Multiple Slots

```javascript
const Card = defineComponent({
  render() {
    return h('div', { class: 'card' }, [
      h('div', { class: 'card-header' }, [
        hSlot() // First slot for header content
      ]),
      h('div', { class: 'card-body' }, [
        hSlot(['Default content']) // Second slot with default
      ])
    ]);
  }
});
```

## Lifecycle Hooks

Components support lifecycle hooks:

```javascript
const LifecycleComponent = defineComponent({
  async onMounted() {
    console.log('Component mounted');
    // Async operations are supported
    await this.initializeData();
  },
  
  onUnmounted() {
    console.log('Component unmounted');
    // Cleanup resources
    this.cleanup();
  },
  
  onPatched() {
    console.log('Component updated');
    // Called after each update
  },
  
  async initializeData() {
    // Load initial data
  },
  
  cleanup() {
    // Clean up timers, etc.
  },
  
  render() {
    return h('div', {}, ['Lifecycle Example']);
  }
});
```

## Best Practices

### Component Organization

```javascript
// components/Button.js
const Button = defineComponent({
  state(props) {
    return {
      loading: false
    };
  },
  
  handleClick() {
    if (this.props.disabled || this.state.loading) return;
    this.props.onClick?.();
  },
  
  render() {
    const { loading } = this.state;
    const { disabled, children } = this.props;
    
    return h('button', {
      class: ['btn', disabled && 'btn-disabled', loading && 'btn-loading'],
      disabled: disabled || loading,
      on: { click: this.handleClick }
    }, children);
  }
});

export default Button;
```

### State Management

1. Keep state minimal and derived data calculated
2. Use local state for component-specific data
3. Use global state for shared application data
4. Batch state updates when possible

### Performance Optimization

1. Use keys for list items to optimize diffing
2. Avoid creating new objects/arrays in render
3. Use fragments to avoid wrapper elements

```javascript
const OptimizedList = defineComponent({
  render() {
    return h('ul', {}, 
      this.state.items.map(item => 
        h('li', { key: item.id }, [item.name])
      )
    );
  }
});
```

### Component Props Diffing Optimization

The framework includes an optimization that skips re-rendering components when their props haven't changed. This is implemented in the `updateProps()` method:

```javascript
// From component.js
updateProps(props) {
  const newProps = { ...this.props, ...props};

  if (equal(this.props, newProps)) {
    return
  }

  this.props = newProps;
  this.#patch();
}
```

The framework uses `fast-deep-equal` library for efficient deep object comparison:

```javascript
import equal from 'fast-deep-equal';
```

**How it works:**
1. When component props are updated, the framework performs a deep equality check
2. If the props haven't changed, the component skips re-rendering entirely
3. This optimization can eliminate the need to check entire branches of the virtual DOM tree
4. The benefit is especially significant for components with large subtrees

**Trade-offs:**
- **Benefit:** Avoids expensive DOM diffing for unchanged components
- **Cost:** Deep object comparison can be expensive for large prop objects
- **Best practices:** Keep props simple and avoid deeply nested objects when possible

### Slot Optimization

The framework includes an automatic optimization for slot rendering to avoid unnecessary DOM traversals. When you use slots, the framework automatically detects if the `hSlot()` function was called during rendering and only performs slot filling when needed:

```javascript
// From component.js
render() {
  const vdom = render.call(this)

  if (didCreateSlot()) {
    fillSlots(vdom, this.#children)
    resetDidCreateSlot()
  }

  return vdom
}
```

This optimization uses a global flag system:

```javascript
// From h.js
let hSlotCalled = false

export function didCreateSlot() {
  return hSlotCalled
}

export function resetDidCreateSlot() {
  hSlotCalled = false
}

export function hSlot(children = []) {
  hSlotCalled = true
  return { type: DOM_TYPES.SLOT, children }
}
```

**How it works:**
1. A global flag tracks when `hSlot()` is called during rendering
2. After rendering, the framework checks if slots were used
3. If no slots were used, the expensive `fillSlots()` traversal is skipped
4. The flag is reset for the next render cycle

This significantly improves performance for components that don't use slots, as they avoid unnecessary DOM tree traversals. The optimization is automatic and requires no developer intervention.


## API Reference

### createApp

Creates an application instance:

```javascript
const app = createApp(RootComponent, props?, options?);
```

### defineComponent

Defines a component:

```javascript
const Component = defineComponent({
  state(props) { /* ... */ },
  render() { /* ... */ },
  onMounted() { /* ... */ },
  onUnmounted() { /* ... */ },
  onPatched() { /* ... */ },
  // Custom methods
});
```

### h

Creates virtual DOM nodes:

```javascript
h('div', props?, children?)
h(Component, props?, children?)
```

### hFragment

Creates fragment nodes:

```javascript
hFragment(children)
```

### hString

Creates text nodes:

```javascript
hString('text content')
```

### hSlot

Creates slot nodes:

```javascript
hSlot(defaultChildren?)
```

### nextTick

Schedules code to run after next update:

```javascript
nextTick().then(() => {
  // Code runs after DOM updates
});
```

### HashRouter

Router class for navigation:

```javascript
const router = new HashRouter(routes);
router.navigateTo(path);
router.back();
router.forward();
```

### GlobalState

Global state management:

```javascript
const store = new GlobalState(initialState);
store.setState(newState);
store.getState;
const unsubscribe = store.subscribe(callback);
```

### HTTP Client

```javascript
dotjs.get(url, component, options?, handleState?)
dotjs.post(url, component, data, options?, handleState?)
dotjs.put(url, component, data, options?, handleState?)
dotjs.patch(url, component, data, options?, handleState?)
dotjs.delete(url, component, options?, handleState?)
```

---

This documentation covers the core functionality of dot-js. For more examples, check out the example project included with the framework.
