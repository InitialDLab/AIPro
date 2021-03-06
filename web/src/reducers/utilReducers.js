import { defaultCredentialAttributes } from '../constants/defaultAttributes';

export const loggedInReducer = (state = false, action) => {
    switch(action.type) {
        case 'SET_LOGGED_IN':
            return action.loggedIn;
        default:
            return state;
    }
}

export const loadingReducer = (state = false, action) => {
    switch(action.type) {
        case 'STOP_LOADING':
            return false;
        case 'START_LOADING':
            return true;
        default:
            return state;
    }
}

const initialUserState = {
    username: 'rsfrost',
    credentials: {
        twitter: defaultCredentialAttributes['twitter']
    }
}
export const userReducer = (state = initialUserState, action) => {
    let tmpState = Object.assign({}, state);
    switch(action.type) {
        case 'SET_USER_CREDENTIAL_ATTRIBUTE':
            if (!tmpState.credentials.hasOwnProperty(action.credentialsType)) {
                console.error(`Previously undefined credentials type: '${action.credentialsType}'`);
                return state;
            }
            const credentials = Object.assign({}, tmpState.credentials);
            const credentialTypeBlock = Object.assign({}, credentials[action.credentialsType]);
            credentialTypeBlock[action.credentialAttribute] = action.credentialValue;

            credentials[action.credentialsType] = credentialTypeBlock;
            tmpState.credentials = credentials;
            return tmpState;
        case 'SET_CURRENT_USERNAME':
            tmpState.username = action.username;
            return tmpState;
        default:
            return state;
    }
}

export const errorReducer = (state = '', action) => {
    switch(action.type) {
        case 'SET_ERROR':
            return action.errorMessage;
        case 'CLEAR_ERROR':
            return '';
        default:
            return state;
    }
}

export const messageReducer = (state = '', action) => {
    switch(action.type) {
        case 'SET_MESSAGE':
            return action.message;
        case 'CLEAR_MESSAGE':
            return '';
        default:
            return state;
    }
}

export const pipelineListReducer = (state = [], action) => {
    let index, pipeline, tmpState;
    switch(action.type) {
        case 'RECEIVE_PIPELINES':
            return action.pipelines;
        case 'SET_PIPELINE_RUNNING':
            index = state.findIndex(pipeline => pipeline.pipeline_alias === action.pipeline_alias);
            if (index !== -1) {
                console.log('Found index');
                pipeline = Object.assign({}, state[index]);
                pipeline.running = action.running;
                pipeline.instance_id = action.instance_id;
                tmpState = state.slice();
                tmpState[index] = pipeline;
                return tmpState;
            }
            else {
                console.log('Couldn\'t find index to start');
                return state;
            }
        default:
            return state;
    }
}

const initialCurrentModuleState = {
    category: 'data_sources',
    type: 'FlatFile',
    index: 0
}
export const currentModuleReducer = (state = initialCurrentModuleState, action) => {
    switch(action.type) {
        case 'SET_CURRENT_MODULE':
            return {
                category: action.category,
                type: action.moduleType,
                index: action.index,
                parentIndex: action.parentIndex,
                parentCategory: action.parentCategory,
                parentOutputIndex: action.parentOutputIndex,
            };
        default:
            return state;
    }
}

export const demoReducer = (state = {'images': []}, action) => {
    switch(action.type) {
        case 'SET_CAPTIONS_DEMO_DATA':
            return action.demoData;
        case 'SET_SENTIMENT_DEMO_DATA':
            return action.demoData;
        default:
            return state;
    }
}
