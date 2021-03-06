'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'
import {connect, Provider} from 'react-redux'
import socket from './socket'

import store from './store'
import App from './components/App'
import Login from './components/Login'
import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import Homepage from './components/Homepage'
import Multiplayer from './components/game/Multiplayer'
import Training from './components/game/Training'
import Loss from './components/game/Loss'
import Win from './components/game/Win'
import Docs from './components/game/Docs'
import Tie from './components/game/Tie'

import {whoami} from './reducers/auth'
import {GetTestRobots} from './reducers/frontendStore'

const onMainEnter = () => {
    store.dispatch(GetTestRobots())
    store.dispatch(whoami())
}

const CanvasDelete = () => {
    const canvases = [...document.getElementsByTagName('canvas')]
    canvases.forEach(canvas => {
        canvas.remove()
    })
}

const onGameEnter = (nextState, replaceState, callback) => {
    store.dispatch(whoami()).then(function() {
        callback()
        if (!Object.keys(store.getState().auth.user).length) {
            browserHistory.push('/login')
        } else {
            const user = store.getState().auth.user
            socket.emit('giveMeARoom', user)
        }
    }).catch(err => {
        console.log(err)
        callback()
    })
}

const onTrainingEnter = () => {
    socket.emit('singleTrainingRoom')
}

render(
    <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/home" component={Homepage} />
      <Route path="/" component={App} onEnter={onMainEnter} >
        <Route path="/docs" component={Docs} />
        <Route path="/game" component={Multiplayer} onEnter={onGameEnter} />
        <Route path="/training" component={Training} onEnter={onTrainingEnter} />
        <Route path="/login" component={Login} />
        <IndexRedirect to="/home" />
      </Route>
      <Route path="/loss" component={Loss} onEnter={CanvasDelete}/>
      <Route path="/win" component={Win} onEnter={CanvasDelete}/>
      <Route path="/tie" component={Tie} onEnter={CanvasDelete}/>
      <Route path='*' component={NotFound} />
    </Router>
</Provider>, document.getElementById('main'))
