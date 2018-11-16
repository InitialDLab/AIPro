export const defaultStorageAttributes = {
    FlatFile: {
        alias: 'My flat file',
        filename: '',
        format: 'json'
    },
    MongoDB: {
        alias: 'My MongoDB connection',
        host: 'localhost',
        port: 27017,
        db: '',
        collection: ''
    },
    IO: {
        alias: 'Standard output'
    }
};

export const defaultDataSourceAttributes = {
    StreamingAPI: {
        alias: 'Twitter Streaming API',
        auto_restart: true,
        projection: [
            'text',
            'created_at',
            'lang'
        ],
        outputs: []
    },
    FlatFile: {
        alias: 'My flat file',
        filename: '',
        outputs: []
    },
    MongoDB: {
        alias: 'My MongoDB connection',
        host: 'localhost',
        port: 27017,
        db: '',
        collection: '',
        outputs: []
    }
}

export const defaultModelAttributes = {
    Custom: {
        alias: 'My custom model',
        module_file_path: '',
        module_classname: '',
        method_name: '',
        output_attribute: '',
        preprocessor: '',
        input_attribute: '',
        outputs: []
    },
    ONNX: {
        alias: 'Image Boundary Classifier'
    },
    Keras: {
        alias: 'My keras model',
        zipfile: ''
    }
}

export const defaultPreprocessorAttributes = {
    Custom: {
        alias: 'My custom preprocessor',
        module_file_path: '',
        module_classname: '',
        method_name: ''
    },
    Prebuilt: {
        alias: 'Text preprocessor'
    }
}

export const defaultCredentialAttributes = {
    twitter: {
        api_key: '',
        api_secret: '',
        access_token: '',
        access_token_secret: ''
    }
}
