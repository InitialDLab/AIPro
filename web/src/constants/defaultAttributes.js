const defaultStorageAttributes = {
    FlatFileStorage: {
        alias: 'My flat file',
        type: 'FlatFileStorage',
        save_filename: '',
    },
    MongoDB: {
        alias: 'My MongoDB connection',
        type: 'MongoDB',
        host: 'localhost',
        port: 27017,
        db: '',
        collection: ''
    },
    IO: {
        alias: 'Standard output',
        type: 'IO',
    }
};

const defaultDataSourceAttributes = {
    TwitterStreamingAPI: {
        alias: 'Twitter Streaming API',
        type: 'TwitterStreamingAPI',
        auto_restart: true,
        projection: [],
        outputs: []
    },
    FlatFileDataSource: {
        alias: 'My flat file',
        type: 'FlatFileDataSource',
        filename: '',
        outputs: []
    },
    MongoDB: {
        alias: 'My MongoDB connection',
        type: 'MongoDB',
        host: 'localhost',
        port: 27017,
        db: '',
        collection: '',
        outputs: []
    }
}

const defaultModelAttributes = {
    CustomModel: {
        alias: 'My custom model',
        type: 'CustomModel',
        module_file_path: '',
        module_classname: '',
        method_name: '',
        output_attribute: '',
        preprocessor: '',
        input_attribute: '',
        outputs: [],
        projection: []
    },
    PrebuiltModel: {
        alias: 'Image Boundary Classifier',
        type: 'PrebuiltModel',
        subtype: '', // ONNX, Keras, etc.
        outputs: [],
    },
}

const defaultCustomEntityAttributes = {
    alias: 'Untitled Custom Entity',
    type: 'CustomEntity',
    classname: '',
    filename: '',
    function: '',
    input_attribute: '',
    output_attribute: '',
    outputs: []
}

const defaultPreprocessorAttributes = {
    CustomPreprocessor: {
        alias: 'My custom preprocessor',
        type: 'CustomPreprocessor',
        module_file_path: '',
        module_classname: '',
        method_name: '',
    },
    PrebuiltPreprocessor: {
        alias: 'Text preprocessor',
        type: 'PrebuiltPreprocessor',
        subtype: 'Text',
    }
}

const defaultFilterAttributes = {
    alias: 'Language filter',
    type: 'Filter',
    attribute: 'lang',
    condition: '==',
    value: 'en',
    outputs: [],
    projection: []
}

export const defaultCredentialAttributes = {
    twitter: {
        api_key: '',
        api_secret: '',
        access_token: '',
        access_token_secret: ''
    }
}

export const defaultModuleAttributes = {
    data_sources: defaultDataSourceAttributes,
    preprocessors: defaultPreprocessorAttributes,
    models: defaultModelAttributes,
    filters: defaultFilterAttributes,
    storage: defaultStorageAttributes,
    custom_entities: defaultCustomEntityAttributes,
}
