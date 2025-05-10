
export class GlobalState {

	constructor(initalState = {}) {
		this.state = {...initalState};
		this.listeners = new Set();
	}

	get getState() {
		return this.state
	}

	setState(newState) {
		this.state = { ...newState }; // ensure new object ref
		this.listeners.forEach(fn => fn(this.state));
	}

	subscribe(fn) {
		this.listeners.add(fn);
		return () => this.listeners.delete(fn); // unsubscribe
	}
}
