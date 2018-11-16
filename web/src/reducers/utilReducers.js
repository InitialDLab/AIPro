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
    username: '',
    credentials: {
        twitter: defaultCredentialAttributes['twitter']
    }
}
export const userReducer = (state = initialUserState, action) => {
    let tmpState = Object.assign({}, initialUserState);
    switch(action.type) {
        case 'SET_USER_CREDENTIAL_ATTRIBUTE':
            if (!tmpState.hasOwnProperty(action.credentialsType)) {
                console.error(`Previously undefined credentials type: '${action.credentialsType}'`);
                return state;
            }

            tmpState[action.credentialsType][action.attribute] = action.value;
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
    switch(action.type) {
        case 'RECEIVE_PIPELINES':
            return action.pipelines;
        default:
            return state;
    }
}
