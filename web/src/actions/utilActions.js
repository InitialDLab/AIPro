import API from '../API';
const api = new API();

export const setLoggedIn = loggedIn => {
    return {
        type: 'SET_LOGGED_IN',
        loggedIn
    };
}

export const setCredentialAttribute = (credentialsType, credentialAttribute, credentialValue) => {
    return {
        type: 'SET_USER_CREDENTIAL_ATTRIBUTE',
        credentialsType,
        credentialAttribute,
        credentialValue
    };
}

export const setCurrentModule = (category, moduleType, index, parentIndex, parentCategory, parentOutputIndex) => {
    return {
        type: 'SET_CURRENT_MODULE',
        category,
        moduleType,
        index,
        parentIndex,
        parentCategory,
        parentOutputIndex,
    };
}

export const setCurrentUsername = username => {
    return {
        type: 'SET_CURRENT_USERNAME',
        username
    };
}

export const setError = errorMessage => {
    return {
        type: 'SET_ERROR',
        errorMessage
    }
}

export const setMessage = message => {
    return {
        type: 'SET_MESSAGE',
        message
    };
}

export const CLEAR_ERROR = {
    type: 'CLEAR_ERROR'
};
export const CLEAR_MESSAGE = {
    type: 'CLEAR_MESSAGE'
};
export const START_LOADING = {
    type: 'START_LOADING'
};
export const STOP_LOADING = {
    type: 'STOP_LOADING'
};

export const setCaptionsDemoData = demoData => {
    return {
        type: 'SET_CAPTIONS_DEMO_DATA',
        demoData
    };
}

export const setSentimentDemoData = demoData => {
    return {
        type: 'SET_SENTIMENT_DEMO_DATA',
        demoData
    };
}

export const loadStreamingCaptionsDemoData = () => {
    return async function(dispatch) {
        dispatch(START_LOADING);
        const response = await api.get('/demo-data/captions');
        dispatch(STOP_LOADING);
        dispatch(setCaptionsDemoData(response));
    }
}

export const loadStreamingSentimentDemoData = () => {
    return async function(dispatch) {
        dispatch(START_LOADING);
        const response  = await  api.get('/demo-data/sentiment');
        dispatch(STOP_LOADING);
        dispatch(setSentimentDemoData(response));
    }
}

export const signup = (username, password, email) => {
    return async function(dispatch) {
        if (username.length === 0) {
            dispatch(setError('Username cannot be empty'));
            return;
        }
        else if (password.length === 0) {
            dispatch(setError('Password cannot be empty'));
            return;
        }
        else if (email.length === 0) {
            dispatch(setError('Email cannot be empty'));
            return;
        }
        
        dispatch(START_LOADING);
        const response = await api.post('/user', {username, password, email});
        dispatch(STOP_LOADING);
        if (response !== false) {
            if (response.success === true) {
                // TODO: Just redirect them to login
                dispatch(setMessage(`${username} signed up successfully. Go login now!`));
            }
            else {
                dispatch(setError(`Couldn't sign up user ${username}, try again?`));
            }
        }
        else {
            dispatch(setError('POST Request to sign up failed :(, try again?'));
        }
    }
}

export const login = (username, password) => {
    return async function(dispatch) {
        dispatch(START_LOADING);
        const response = await api.post(`/login`, {username, password});
        dispatch(STOP_LOADING);
        if (response !== false) {
            if (response.success === true){
                dispatch(setLoggedIn(true));
                dispatch(setCurrentUsername(username));
            }
            else {
                dispatch(setError('Incorrect username and/or password, try again'));
            }
        }
        else {
            dispatch(setError('Error logging in, try again'));
        }
    }
}

export const logout = () => {
    return async function(dispatch) {
        dispatch(START_LOADING);
        const response = await api.post('/logout', {});
        if (response !== false) {
            dispatch(setLoggedIn(false));
        }
        else {
            dispatch(setError('Error logging out, try again'));
        }
    }
}

export const loadCredentials = (username, account_type) => {
    return async function(dispatch) {
        dispatch(START_LOADING);
        if (!username) {
            console.error('Missing username');
        }
        const url = encodeURI(`/${username}/account/${account_type}`);
        try{
            const account_info = await api.get(url);
            
            if (account_info.message) {
                console.log(account_info.message);
            }
            else {
                for (let attribute of ['api_key', 'api_secret', 'access_token', 'access_token_secret']) {
                    dispatch(setCredentialAttribute('twitter', attribute, account_info[attribute]));
                }
            }
        } catch(err) {
            console.error('Error with getting Twitter account credentials, removing this');
            console.error(err);
        }
    }
}
