import { defaultModuleAttributes } from '../constants/defaultAttributes';
import defaultState from '../constants/defaultState';

const initialPipeline = defaultState.currentPipeline;
const newPipeline = {
    pipeline_alias: 'Untitled Pipeline',
    data_sources: [
        {
            alias: 'Untitled Data Source',
            type: 'FlatFile',
            outputs: [],
            projection: [],
        }
    ],
    models: [],
    filters: [],
    storage: [],
    preprocessors: [],
    custom_entities: [],
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

const pipelineReducer = (pipeline = initialPipeline, action) => {
    const tmpPipeline = Object.assign({}, pipeline);
    switch(action.type) {
        case 'ADD_MODULE':
            return addModuleCase(tmpPipeline, action);
        case 'ADD_OUTPUT':
            return addOutputCase(tmpPipeline, action);
        case 'UPDATE_OUTPUT':
            return updateOutputCase(tmpPipeline, action);
        case 'SAVE_PIPELINE_ALIAS':
            tmpPipeline.pipeline_alias = action.pipeline_alias;
            return tmpPipeline;
        case 'CREATE_NEW_PIPELINE':
            return Object.assign({}, initialPipeline);
        case 'UPDATE_MODULE':
            return updateModuleCase(tmpPipeline, action);
        default:
            return tmpPipeline;
    }
}

export default pipelineReducer;
