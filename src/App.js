import React from 'react';
import './style.css';
import { Router } from "@reach/router";
import Login from "./components/Login/Login";
import Help from "./components/HelpPage/Help";
import Sites from "./components/Sites/Sites";
import Tasks from "./components/Tasks/Tasks"

import { connect, Provider } from 'react-redux'
import { bindActionCreators } from 'redux'
import { store, persistor } from '../src/store/configureStore'
import { changeUser, enterApp } from './redux/actions/users'
import { changePlaces, visitPlaces } from './redux/actions/places'
import { changeTasks, addTasks, changeCurrentTasks, completeTask, changeCurrentTask, changeCurrentTasksList } from './redux/actions/tasks'
import { PersistGate } from 'redux-persist/integration/react'

// test
function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Router>
					<LoginConnected path="/" />
					<SitesConnected path="/Sites/:username" />
					<HelpConnected path="/Help/:username" />
					<TasksConnected path="/Tasks/:username" />
				</Router>
			</PersistGate>
		</Provider>
	);
}

// Pick the props that we will use
const mapStateToProps = state => ({
	user: state.user,
	user_places: state.user_places,
	user_tasks: state.user_tasks,
});


// Pick the actions that we will use
const ActionCreators = Object.assign(
	{},
	{ changeUser, enterApp },
	{ changePlaces, visitPlaces },
	{ changeTasks, addTasks, changeCurrentTasks, completeTask, changeCurrentTask, changeCurrentTasksList },
);

const mapDispatchToProps = dispatch => ({
	actions: bindActionCreators(ActionCreators, dispatch),
});

// Connect the screens to Redux
let LoginConnected = connect(mapStateToProps, mapDispatchToProps)(Login)
let SitesConnected = connect(mapStateToProps, mapDispatchToProps)(Sites)
let TasksConnected = connect(mapStateToProps, mapDispatchToProps)(Tasks)
let HelpConnected = connect(mapStateToProps, mapDispatchToProps)(Help)


export default App;
