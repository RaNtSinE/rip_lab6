import React, {Component} from 'react';
import './App.css';
import Main from "./task/main/Main";
import TaskWindow from "./task/taskWindow/TaskWindow";
import EditWindow from "./task/editWindow/EditWindow";
import {TaskController} from "./network/TaskController";
import consts from "./Consts";

const taskController = new TaskController();

class App extends Component {

    constructor(props) {
        super(props);

        this.tasks = [];

        this.state = {
            window: '',
            tasks: [],
            currentTask: -1,
            editMode: "",
            connect: false
        };

        this.collectionResponse = null;

        this.loadData = this.loadData.bind(this);
        this.createTask = this.createTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.getTaskIndexById = this.getTaskIndexById.bind(this);
        this.holderCreateTask = this.holderCreateTask.bind(this);
        this.holderDeleteTask = this.holderDeleteTask.bind(this);
        this.holderUpdateTask = this.holderUpdateTask.bind(this);
        this.changeWindow = this.changeWindow.bind(this);
        this.selectTask = this.selectTask.bind(this);
        this.changeEditMode = this.changeEditMode.bind(this);
        this.updateIsComplete = this.updateIsComplete.bind(this);
        this.holderConnect = this.holderConnect.bind(this);
        this.holderMessage = this.holderMessage.bind(this);
    }

    componentDidMount() {
        this.collectionResponse = {
            'getAll': this.loadData,
            'createTask': this.holderCreateTask,
            'updateTask': this.holderUpdateTask,
            'updateIsComplete': this.holderUpdateTask,
            'deleteTask': this.holderDeleteTask
        }

        taskController.start(this.holderMessage, "ws://localhost:8080/ws", this.holderDisconnect, this.holderConnect);
    }

    holderCreateTask(data) {
        if (data && data.task) {
            this.tasks.push(data.task);

            this.setState({tasks: this.tasks});
        }
    }

    holderUpdateTask(data) {
        if (data && data.task) {
            let taskIndex = this.getTaskIndexById(data.task.id)
            this.tasks[taskIndex] = data.task;

            this.setState({tasks: this.tasks});
        }
    }

    holderDeleteTask(data) {
        if (data && data.task) {
            console.log(data.task.id);
            let taskIndex = this.getTaskIndexById(data.task.id)
            this.tasks.splice(taskIndex, 1);

            this.setState({tasks: this.tasks});
        }
    }

    holderMessage(data) {
        console.log(data);

        this.collectionResponse[data.action] &&
        this.collectionResponse[data.action](data);
    }

     loadData(data) {
        this.tasks = data.task;
        this.setState({tasks: this.tasks});
    }

    changeWindow(window) {
        this.setState({window: window});
    }

    changeEditMode(mode) {
        this.setState({editMode: mode});
    }

    createTask(task) {
        taskController.createTask(task, this.state.connect);
    }

    updateTask(task) {
        taskController.updateTask(task, this.state.connect);
    }

    deleteTask(id) {
        taskController.deleteTask({id: id}, this.state.connect);
    }

    selectTask(id) {
        this.setState({currentTask: id})
    }

    updateIsComplete(id, checked) {
        taskController.updateIsComplete({id: id}, this.state.connect);
    }

    getTaskIndexById(id) {
        return this.tasks.findIndex(currentTask => currentTask.id === id);
    }

    holderConnect() {
        this.setState({connectWaiting: true, sendFirstState: false})
        if (!this.state.connect) {
            this.setState({connect: true});
        }
    }

    holderDisconnect() {
        taskController.start(this.holderMessage, "ws://localhost:8080/ws", this.holderDisconnect, this.holderConnect)
    }

    render() {
        let window;

        switch (this.state.window) {
            case consts.EDIT_WINDOW:
                window = <EditWindow
                    createTask={this.createTask}
                    updateTask={this.updateTask}
                    selectTask={this.selectTask}
                    currentStateTask={this.state.currentTask}
                    changeWindow={this.changeWindow}
                    changeEditMode={this.changeEditMode}
                    currentTask={this.state.tasks[this.getTaskIndexById(this.state.currentTask)]}
                    editMode={this.state.editMode}
                />;
                break;
            case consts.TASK_WINDOW:
                window = <TaskWindow deleteTask={this.deleteTask}
                                     changeWindow={this.changeWindow}
                                     changeEditMode={this.changeEditMode}
                                     selectTask={this.selectTask}
                                     currentTask={this.state.tasks[this.getTaskIndexById(this.state.currentTask)]}
                />;
                break;
            default:
                window = '';
                break;
        }

        return (
            <div className="App">
                <Main
                    tasks={this.state.tasks}
                    changeWindow={this.changeWindow}
                    changeEditMode={this.changeEditMode}
                    selectTask={this.selectTask}
                    updateIsComplete={this.updateIsComplete}
                />
                {window}
            </div>
        );
    }
}

export default App;
