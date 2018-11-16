const initialState = {
    data_sources: [],
    models: [],
    filters: [],
    storage: [],
    preprocessors: [],
    custom_entities: [],
};

const pipelineReducer = (state = initialState, action) => {
    let tmpState = Object.assign({}, initialState), index = action.index;
    if (!action.hasOwnProperty('moduleType')) {
        console.log(`Other action type for module reducer: ${action.type}`);
        return state;
    }
    const moduleType = action.moduleType;
    if (!tmpState.hasOwnProperty('moduleType')) {
        console.error(`Unknown module type: ${moduleType}`);
        return state;
    }

    const tmpModules = tmpState[moduleType];
    switch(action.type) {
        case 'CREATE_NEW_PIPELINE':
            // TODO: Create new pipeline
            break;
        case 'ADD_MODULE':
            return {
                ...tmpState,
                [moduleType]: tmpModules.concat(action.payload)
            };
        case 'EDIT_MODULE':
            const attribute = action.attribute;
            if (index > tmpModules.length - 1) {
                console.error(`Attempting to edit module type ${action.moduleType} at invalid index (index ${index}, array length ${tmpModules.length})`);
                return state;
            }
            
            tmpModules[index][attribute] = action.value;
            
            return {
                ...tmpState,
                [moduleType]: tmpModules
            };
        case 'DELETE_MODULE':
            if (index > tmpModules.length - 1) {
                console.error(`Attempting to delete module type ${action.moduleType} at invalid index (index ${index}, array length ${tmpModules.length})`);
                return state;
            }
            
            tmpModules.splice(index, 1);
            
            return {
                ...tmpState,
                [moduleType]: tmpModules
            };
        case 'ADD_OUTPUTS':
            console.log('TODO: ADD_OUTPUTS action type');
            break;
        case 'UPDATE_OUTPUT':
        console.log('TODO: UPDATE_OUTPUT action type');
            break;
        default:
            return state;
    }
}

export default pipelineReducer;
