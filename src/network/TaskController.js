import { Network } from './Network';
import { EventEmitter } from "./EventEmitter";

const network = new Network();

export class TaskController extends EventEmitter {
    constructor() {
        super();

        this.init = false
        this.connect = false
    }


    start(holderMessage, serverPath, holderDisconnect, holderConnect) {
        if (!this.init) {
            network.addListen('onConnect', this.onConnect);
            network.addListen('onDisconnect', this.onDisconnect);
            network.addListen('onMessage', this.onMessage);
            network.addListen('onError', this.onError);
            this.init = true
        }

        network.connect(serverPath, holderConnect);
        network.message(holderMessage);
        network.disconnect(holderDisconnect);
        network.error();
    }

    getAll(connect) {
        if (connect)
            network.send({
                'action': 'getAll'
            })
    }

    createTask(task, connect) {
        if (connect) {
            network.send({
                'action': 'createTask',
                'task': task});
        }
    }

    updateTask(task, connect) {
        if (connect) {
            network.send({
                'action': 'updateTask',
                'task': task});
        }
    }

    updateIsComplete(task, connect) {
        if (connect) {
            network.send({
                'action': 'updateIsComplete',
                'task': task});
        }
    }

    deleteTask(task, connect) {
        if (connect) {
            network.send({
                'action': 'deleteTask',
                'task': task});
        }
    }

    makeDisconnect() {
        network.closeConnection();
    }

    onConnect(data, connect) {
        console.log("connect");

            network.send({
                'action': 'getAll'
            })
    }

    onDisconnect(data) {
        console.log("disconnect")
    }

    onMessage(data) {

    }

    onError(data) {
        console.log(data);
        console.log("error")
    }
}
