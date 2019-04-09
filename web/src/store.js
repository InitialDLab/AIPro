import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { 
    loadingReducer, 
    userReducer, 
    errorReducer, 
    messageReducer, 
    loggedInReducer, 
    pipelineListReducer,
    currentModuleReducer,
    demoReducer
} from './reducers/utilReducers';
import pipelineReducer from './reducers/pipelineReducer';

const loggerMiddleware = createLogger();

const rootReducer = combineReducers({
    error: errorReducer,
    message: messageReducer,
    loggedIn: loggedInReducer,
    isLoading: loadingReducer,
    currentUser: userReducer,
    currentPipeline: pipelineReducer,
    pipelines: pipelineListReducer,
    currentModule: currentModuleReducer,
    demo: demoReducer,
});

const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);
export default store;
