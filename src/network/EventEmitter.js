export class EventEmitter {

    constructor() {
        this._events = {};
    }

    addListen(name, listenerToAdd) {
        if (!this._events[name]) {
            this._events[name] = [];
        }

        this._events[name].push(listenerToAdd);
    }

    removeListener(name, listenerToRemove) {
        if (!this._events[name]) {
            throw new Error(`Can't remove a listener. Event "${name}" doesn't exits.`);
        }

        const filterListeners = (listener) => listener !== listenerToRemove;

        this._events[name] = this._events[name].filter(filterListeners);
    }

    emit(name, data) {
        if (!this._events[name]) {
            throw new Error(`Can't emit an event. Event "${name}" doesn't exits.`);
        }

        const fireCallbacks = (callback) => {
            callback(data);
        };
        this._events[name].forEach(fireCallbacks);
    }
}
