import API from '../API';
import { setError, START_LOADING, STOP_LOADING, setMessage } from './utilActions';
const api = new API();

export const selectModule = (moduleType, index) => {
    return {
        type: 'SELECT_MODULE',
        moduleType,
        index
    };
}

export const updateModule = (moduleType, index, attribute, value) => {
    return {
        type: 'UPDATE_MODULE',
        moduleType,
        index,
        attribute,
        value
    };
}

export const addModule = (moduleType) => {
    return {
        type: 'ADD_MODULE',
        moduleType
    };
}

export const deleteModule = (moduleType, index) => {
    return {
        type: 'DELETE_MODULE',
        moduleType,
        index
    };
}

export const addOutput = (parentModuleType, parentIndex, outputAlias) => {
    return {
        type: 'ADD_OUTPUT',
        parentModuleType,
        parentIndex,
        outputAlias
    };
}

export const deleteOutput = (parentModuleType, parentIndex, outputAlias) => {
    return {
        type: 'DELETE_OUTPUT',
        parentModuleType,
        parentIndex,
        outputAlias
    };
}
export const receiveSinglePipeline = (pipeline) => {
    return {
        type: 'RECEIVE_SINGLE_PIPELINE',
        pipeline
    };
}

export const receivePipelines = (pipelines) => {
    return {
        type: 'RECEIVE_PIPELINES',
        pipelines
    };
}

export const CREATE_NEW_PIPELINE = {
    type: 'CREATE_NEW_PIPELINE'
};

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

export const loadAllPipelines = (username) => {
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

export const savePipeline = (username, pipeline) => {
    return async function(dispatch) {
        dispatch(START_LOADING);
        const response = await api.post(`/${username}/pipeline`, pipeline);
        dispatch(STOP_LOADING);
        if (response !== false) {
            const saveResult = response.success;
            if (saveResult === true) {
                dispatch(setMessage('Pipeline successfully saved'));
            }
        }
    }
}

export const deletePipeline = (username, pipeline) => {
    return async function(dispatch) {
        dispatch(START_LOADING);
        const response = await api.delete(`/${username}/pipeline`, pipeline);
        dispatch(STOP_LOADING);
        if (response !== false) {
            const deleteResult = response.success;
            if (deleteResult === true) {
                dispatch(setMessage('Pipeline successfully deleted'));
                dispatch(CREATE_NEW_PIPELINE);
            }
            else {
                dispatch(setError(`Pipeline could not be deleted: ${response.message || 'unknown error'}`));
            }
        }
    }
}

// TODO: Validate pipeline

// TODO: Start pipeline

// TODO: Stop pipeline

// TODO: Check pipeline status
