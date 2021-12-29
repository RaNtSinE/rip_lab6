import { EventEmitter } from "./EventEmitter";

export class Network extends EventEmitter {
    serverUrl;
    constructor() {
        super();

        this.socket = null;
    }

    connect(url, onConnect) {
        this.serverUrl = url;
        this.socket = new WebSocket(url);
        let connect = onConnect
        this.socket.onopen = (event) => this.onOpen(event, connect);
    }

    closeConnection() {
        this.socket.close();
    }

    disconnect(onDisconnect) {
        let disconnect = onDisconnect
        this.socket.onclose = (event) => this.onClose(event, disconnect);
    }

    message(onMessage) {
        let message = onMessage;
        this.socket.onmessage = (event) => this.onMessage(event, message);
    }

    error() {
        this.socket.onerror = () => this.onError();
    }

    onOpen(data, connect) {
        connect();
        this.emit('onConnect', data);
    }

    onMessage(data, message) {
        this.emit('onMessage', data.data);
        let incomingData = JSON.parse(data.data);

        message(incomingData);
    }

    onClose(data, disconnect) {
        this.emit('onDisconnect', data);
        disconnect();
    }

    onError(data) {
        this.emit('onError', data);
    }

    send(data) {
        let myData = JSON.stringify(data);
        console.log(myData);
        this.socket.send(myData);
    }
}
