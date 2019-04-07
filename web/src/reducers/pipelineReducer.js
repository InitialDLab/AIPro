import { defaultModuleAttributes } from '../constants/defaultAttributes';
import defaultState from '../constants/defaultState';

const initialPipeline = defaultState.currentPipeline;
const newBatchPipeline = {
    pipeline_alias: 'Untitled Pipeline',
    running: false,
    data_sources: [
        {
            alias: 'Untitled Data Source',
            type: 'FlatFileDataSource',
            filename: '',
            outputs: [],
            projection: [],
        }
    ],
    models: [],
    filters: [],
    storage: [],
    preprocessors: [],
    custom_entities: [],
    messaging: {
        host: 'localhost'
    },
};
const newStreamingPipeline = {
    pipeline_alias: 'Untitled Pipeline',
    running: false,
    data_sources: [
        {
            alias: 'Untitled Data Source',
            type: 'TwitterStreamingAPI',
            filename: '',
            outputs: [],
            projection: [],
        }
    ],
    models: [],
    filters: [],
    storage: [],
    preprocessors: [],
    custom_entities: [],
    messaging: {
        host: 'localhost'
    },
};
const newStreamingImagesPipeline = {
    pipeline_alias: 'Streaming Images Pipeline',
    running: false,
    data_sources: [
        {
            alias: 'Untitled Data Source',
            type: 'StreamingImagesAPI',
            url: 'http://example.com',
            http_method: 'GET',
            outputs: [],
            projection: [],
        }
    ],
    models: [],
    filters: [],
    storage: [],
    preprocessors: [],
    custom_entities: [],
    messaging: {
        host: 'localhost'
    },
};

const getDefaultAttributes = (category, moduleType) => {
    if (!defaultModuleAttributes.hasOwnProperty(category)) {
        console.error(`Unknown module type ${category}`);
        return null;
    }

    if (category === 'filters' || category === 'custom_entities') {
        return Object.assign({}, defaultModuleAttributes[category]);
    }

    else if (!defaultModuleAttributes[category].hasOwnProperty(moduleType)) {
        console.error(`Unknown module subtype ${moduleType}`);
        return null;
    }

    return Object.assign({}, defaultModuleAttributes[category][moduleType]);
}

const addModuleCase = (tmpPipeline, action) => {
    const modules = tmpPipeline[action.category].slice();
    const defaultAttrs = getDefaultAttributes(action.category, action.moduleType);
    defaultAttrs.alias = action.alias;
    modules.push(defaultAttrs);
    return {
        ...tmpPipeline,
        [action.category]: modules
    };
}

const updateModuleCase = (tmpPipeline, action) => {
    const attribute = action.attribute;
    const index = action.index;
    const category = action.category;
    if (index > tmpPipeline[category].length - 1 || index < 0) {
        console.error(`Attempting to edit module type ${category} at invalid index (index ${index}, array length ${tmpPipeline[category].length})`);
        return tmpPipeline;
    }
    
    const tmpModules = tmpPipeline[category].slice();
    const currentModule = Object.assign({}, tmpModules[index]);
    currentModule[attribute] = action.value;
    tmpModules[index] = currentModule;

    return {
        ...tmpPipeline,
        [category]: tmpModules
    };
}

const saveModuleCase = (tmpPipeline, action) => {
    console.log(action.moduleData);
    const moduleToSave = Object.assign({}, action.moduleData);
    tmpPipeline[action.category][action.index] = moduleToSave;
    return tmpPipeline;
}

const addOutputCase = (tmpPipeline, action) => {
    // category, index, outputAlias
    const modules = tmpPipeline[action.category].slice();
    const currentModule = Object.assign({}, modules[action.index]);
    const outputs = currentModule.outputs.slice();
    outputs.push(action.outputAlias);
    currentModule.outputs = outputs;
    modules[action.index] = currentModule;
    return {
        ...tmpPipeline,
        [action.category]: modules
    };
}

const updateOutputCase = (tmpPipeline, action) => {
    const outputAlias = action.outputAlias;
    const category = action.category;
    const index = action.index;
    const outputIndex = action.outputIndex;
    
    const modules = tmpPipeline[category].slice();
    const moduleToUpdate = Object.assign({}, modules[index]);
    const outputs = moduleToUpdate.outputs.slice();
    outputs[outputIndex] = outputAlias;
    moduleToUpdate.outputs = outputs;
    modules[index] = moduleToUpdate;
    tmpPipeline[category] = modules;
    return tmpPipeline;
}

const findAliasCategory = (tmpPipeline, alias) => {
    if (tmpPipeline.filters.find(filter => filter.alias === alias))
        return 'filters';
    else if (tmpPipeline.data_sources.find(data_source => data_source.alias === alias))
        return 'data_sources';
    else if (tmpPipeline.models.find(model => model.alias === alias))
        return 'models';
    else
        return null;
}

const deleteModuleCase = (tmpPipeline, category, moduleIndex) => {
    // Recursively find the children first
    if (category !== 'storage'){
        for (let i = 0; i < tmpPipeline[category][moduleIndex].outputs.length; i++) {
            const recAlias = tmpPipeline[category][moduleIndex].outputs[i];
            const recCategory = findAliasCategory(tmpPipeline, recAlias);
            if (recCategory) {
                const recIndex = tmpPipeline[recCategory].findIndex(value => value.alias === recAlias);
                deleteModuleCase(tmpPipeline, recCategory, recIndex);
            }
        }
    }
    
    // Delete module
    const alias = tmpPipeline[category][moduleIndex].alias;
    const byCategory = tmpPipeline[category].slice();
    byCategory.splice(moduleIndex, 1);
    tmpPipeline[category] = byCategory;

    // Delete references
    // Data sources   
    for (let [index, data_source] of tmpPipeline['data_sources'].entries()) {
        let deleteIndex = -1;
        for (let i = 0; i < data_source.outputs.length; i++) {
            if (data_source.outputs[i] === alias) {
                deleteIndex = i;
                break;
            }
        }
        if (deleteIndex !== -1) {
            tmpPipeline['data_sources'][index].outputs.splice(deleteIndex, 1);
        }
    }
    
    // Models
    for (let [index, model] of tmpPipeline['models'].entries()) {
        let deleteIndex = -1;
        for (let i = 0; i < model.outputs.length; i++) {
            if (model.outputs[i] === alias) {
                deleteIndex = i;
                break;
            }
        }
        if (deleteIndex !== -1) {
            tmpPipeline['models'][index].outputs.splice(deleteIndex, 1);
        }
    }

    // Filters
    for (let [index, filter] of tmpPipeline['filters'].entries()) {
        let deleteIndex = -1;
        for (let i = 0; i < filter.outputs.length; i++) {
            if (filter.outputs[i] === alias) {
                deleteIndex = i;
                break;
            }
        }
        if (deleteIndex !== -1) {
            tmpPipeline['filters'][index].outputs.splice(deleteIndex, 1);
        }
    }

    // Recursively look for the other children
    tmpPipeline.filters.forEach((filter, index) => {
        if (filter.alias === alias) {
            deleteModuleCase(tmpPipeline, 'filters', )
        }
    })

    return tmpPipeline;
}

const pipelineReducer = (pipeline = initialPipeline, action) => {
    const tmpPipeline = Object.assign({}, pipeline);
    switch(action.type) {
        case 'ADD_MODULE':
            return addModuleCase(tmpPipeline, action);
        case 'UPDATE_MODULE':
            return updateModuleCase(tmpPipeline, action);
        case 'SAVE_MODULE':
            return saveModuleCase(tmpPipeline, action);
        case 'DELETE_MODULE':
            return deleteModuleCase(tmpPipeline, action.category, action.index);
        case 'ADD_OUTPUT':
            return addOutputCase(tmpPipeline, action);
        case 'UPDATE_OUTPUT':
            return updateOutputCase(tmpPipeline, action);
        case 'SAVE_PIPELINE_ALIAS':
            tmpPipeline.pipeline_alias = action.pipeline_alias;
            return tmpPipeline;
        case 'CREATE_NEW_PIPELINE':
            if (action.dataSourceType === 'batch')
                return Object.assign({}, newBatchPipeline);
            else if (action.dataSourceType === 'streaming')
                return Object.assign({}, newStreamingPipeline);
            else if (action.dataSourceType === 'streaming-images')
                return Object.assign({}, newStreamingImagesPipeline);
            else
                return pipeline;
        case 'RECEIVE_SINGLE_PIPELINE':
            return Object.assign({}, action.pipeline);
        default:
            return tmpPipeline;
    }
}

export default pipelineReducer;
