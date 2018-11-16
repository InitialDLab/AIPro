import API from '../API';
const api = new API();

export const setLoggedIn = (loggedIn) => {
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

export const setCurrentUsername = (username) => {
    return {
        type: 'SET_CURRENT_USERNAME',
        username
    };
}

export const setError = (errorMessage) => {
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
            dispatch(setError('Error loggign out, try again'));
        }
    }
}
