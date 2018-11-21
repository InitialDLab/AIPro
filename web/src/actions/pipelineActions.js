import API from '../API';
import { setError, START_LOADING, STOP_LOADING, setMessage } from './utilActions';
const api = new API();

// To be deprecated...
export const updateModule = (category, index, attribute, value) => {
    return {
        type: 'UPDATE_MODULE',
        category,
        index,
        attribute,
        value
    };
}

export const saveModule = (category, index, moduleData) => {
    return {
        type: 'SAVE_MODULE',
        category,
        index,
        moduleData,
    }
}

export const addModule = (alias, category, moduleType) => {
    return {
        type: 'ADD_MODULE',
        alias,
        category,
        moduleType
    };
}

export const deleteModule = (category, index) => {
    return {
        type: 'DELETE_MODULE',
        category,
        index
    };
}

export const addOutput = (category, index, outputAlias) => {
    return {
        type: 'ADD_OUTPUT',
        category,
        index,
        outputAlias
    };
}

export const updateOutput = (category, index, outputIndex, outputAlias) => {
    return {
        type: 'UPDATE_OUTPUT',
        category,
        index,
        outputIndex,
        outputAlias,
    }
}

export const deleteOutput = (category, index, outputAlias) => {
    return {
        type: 'DELETE_OUTPUT',
        category,
        index,
        outputAlias
    };
}

export const receiveSinglePipeline = pipeline => {
    return {
        type: 'RECEIVE_SINGLE_PIPELINE',
        pipeline
    };
}

export const receivePipelines = pipelines => {
    return {
        type: 'RECEIVE_PIPELINES',
        pipelines
    };
}

export const createNewPipeline = dataSourceType => {
    return {
        type: 'CREATE_NEW_PIPELINE',
        dataSourceType,
    }
};

export const savePipelineAlias = pipeline_alias => {
    return {
        type: 'SAVE_PIPELINE_ALIAS',
        pipeline_alias
    };
}

export const loadPipeline = (username, alias) => {
    return async function(dispatch) {
        dispatch(START_LOADING);
        const url = `/${username}/pipelines/${alias}`;
        const response = await api.get(url);
        dispatch(STOP_LOADING);
        if (response !== false) {
            dispatch(receiveSinglePipeline(response.pipeline));
        }
        else {
            dispatch(setError('Error loading pipeline, try again later'));
        }
    }
}

export const loadAllPipelines = username => {
    return async function(dispatch) {
        dispatch(START_LOADING);
        const response = await api.get(`/${username}/pipelines`);
        dispatch(STOP_LOADING);
        if (response !== false) {
            const pipelines = response.pipelines;
            dispatch(receivePipelines(pipelines));
        }
        else {
            dispatch(setError)
        }
    }
}

const buildTwitterDataSource = (currentUser, pipeline, dispatch) => {
    // Check to see if there's a Twitter Streaming API in there
    let editIndex = -1;
    for (let i = 0; i < pipeline.data_sources.length; i++) {
        if (pipeline.data_sources[i].type === 'TwitterStreamingAPI') {
            editIndex = i;
            break;
        }
    }

    if (editIndex !== -1) {
        const twitterCredentials = currentUser.credentials.twitter;
        for (let key of ['api_key', 'api_secret', 'access_token', 'access_token_secret']) {
            if (twitterCredentials[key].length === 0) {
                dispatch(setError(`Make sure to add your Twitter credentials, '${key}' cannot be empty`));
                return false;
            }
        }
        const twitterModule = Object.assign(twitterCredentials, pipeline.data_sources[editIndex]);
        pipeline.data_sources[editIndex] = twitterModule;
        return pipeline;
    }
    else {
        return pipeline;
    }
}

export const savePipeline = (currentUser, pipeline) => {
    return async function(dispatch) {
        dispatch(START_LOADING);
        if (pipeline.pipeline_alias.length === 0) {
            dispatch(setError('Pipeline alias cannot be empty'));
            return;
        }
        const username = currentUser.username;
        if (username.length === 0) {
            dispatch(setError('Username cannot be empty'));
            return;
        }
        const tmpPipeline = buildTwitterDataSource(currentUser, pipeline, dispatch);
        if (tmpPipeline === false) 
            return;
        tmpPipeline.username = username;
        const response = await api.post(`/${username}/pipeline`, tmpPipeline);
        dispatch(STOP_LOADING);
        if (response !== false) {
            const saveResult = response.success;
            if (saveResult === true) {
                dispatch(setMessage('Pipeline successfully saved'));
            }
        }
    }
}

export const deletePipeline = (username, pipeline_alias) => {
    return async function(dispatch) {
        dispatch(START_LOADING);
        const response = await api.delete(`/${username}/pipeline`, {pipeline_alias});
        dispatch(STOP_LOADING);
        if (response !== false) {
            const deleteResult = response.success;
            if (deleteResult === true) {
                dispatch(setMessage('Pipeline successfully deleted'));
                dispatch(loadAllPipelines(username));
            }
            else {
                dispatch(setError(`Pipeline could not be deleted: ${response.message || 'unknown error'}`));
            }
        }
    }
}

export const uploadFile = (category, index, attribute, file) => {
    return async function(dispatch) {
        dispatch(START_LOADING);
        let formData = new FormData();
        formData.append('file', file);
        formData.append('filename', file.name);
        const uploadResult = await api.post('/upload', formData);
        // TODO: Handle upload result
        if (uploadResult !== false) {
            dispatch(setMessage('File uploaded successfully'));
        }
        else {
            dispatch(setError('Couldn\'t upload file'));
        }

        dispatch(updateModule(category, index, attribute, file.name));
        dispatch(STOP_LOADING);

    }
}

// TODO: Validate pipeline

// TODO: Start pipeline

// TODO: Stop pipeline

// TODO: Check pipeline status
