
export class GlobalState {

	constructor(initalState = {}) {
		this.state = {...initalState};
		this.listeners = new Set();
	}

	get getState() {
		return this.state
	}

	setState(newState) {
		console.log('setState called with:', newState);
		this.state = { ...newState }; // ensure new object ref
		this.listeners.forEach(fn => fn(this.state));
	}

	subscribe(fn) {
		console.log('Subscriber added');
		this.listeners.add(fn);
		return () => this.listeners.delete(fn); // unsubscribe
	}
}
