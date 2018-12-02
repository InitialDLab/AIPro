const defaultState = {
    error: '',
    message: '',
    loggedIn: true,
    currentUser: {
        username: 'rsfrost',
        credentials: {
            twitter: {
                api_key: '',
                api_secret: '',
                access_token: '',
                access_token_secret: ''
            }   
        }
    },
    pipelines: [
        
    ],
    isLoading: false,
    currentModule: {
        category: 'data_sources',
        type: 'TwitterStreamingAPI',
        index: 0,
        parentIndex: -1,
        parentCategory: 'root',
        parentOutputIndex: -1,
    },
    currentPipeline: {
        pipeline_alias: 'My pipeline',
        running: false,
        data_sources: [
            {
                alias: 'Twitter Streaming Connection',
                type: 'TwitterStreamingAPI',
                outputs: [
                    'Language filter'
                ],
                filters: [],
                projection: []
            }
        ],
        models: [
            {
                alias: 'Sentiment classifier',
                type: 'CustomModel',
                model_classname: 'Sentiment',
                model_filename: 'sentiment.py',
                model_function: 'predict',
                preprocessor: 'Text preprocessor',
                output_attribute: 'sentiment_score',
                outputs: [
                    'Is happy filter',
                    'Is angry filter'
                ],
                projection: []
            }
        ],
        filters: [
            {
                alias: 'Language filter',
                attribute: 'lang',
                type: 'Filter',
                condition: '==',
                value: 'en',
                outputs: [
                    'Sentiment classifier'
                ],
                projection: []
            },
            {
                alias: 'Is happy filter',
                attribute: 'sentiment_score',
                type: 'Filter',
                condition: '>',
                value: 0.7,
                outputs: [
                    'Happy tweets file'
                ],
                projection: []
            },
            {
                alias: 'Is angry filter',
                attribute: 'sentiment_score',
                type: 'Filter',
                condition: '<',
                value: 0.3,
                outputs: [
                    'Angry tweets file'
                ],
                projection: []
            }
        ],
        storage: [
            {
                alias: 'Happy tweets file',
                type: 'FlatFileStorage',
                save_filename: 'happytweets.json',
                format: 'json lines'
            },
            {
                alias: 'Angry tweets file',
                type: 'FlatFileStorage',
                save_filename: 'angrytweets.json',
                format: 'json lines'
            }
        ],
        preprocessors: [
            {
                alias: 'Text preprocessor',
                type: 'PrebuiltPreprocessor',
                subtype: 'Text',
            }
        ],
        custom_entities: [
            {
                alias: 'Untitled custom entity',
                type: 'CustomEntity',
                classname: '',
                filename: '',
                function: '',
                input_attribute: '',
                output_attribute: '',
                outputs: []
            }
        ],
        messaging: {
            host: 'localhost'
        },
    }
}

export default defaultState;
