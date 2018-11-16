state = {
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
        type: 'data_sources',
        index: 0
    },
    currentPipeline: {
        data_sources: [
            {
                alias: 'Test alias',
                type: 'API',
                subtype: 'Twitter streaming',
                filters: [
                    '@richiefrost'
                ],
                outputs: [
                    'Language filter'
                ],
                projection: [
                    'text',
                    'lang',
                    'created_at'
                ]
            }
        ],
        models: [
            {
                alias: 'Sentiment classifier',
                type: 'Custom model',
                subtype: 'Keras',
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
                filename: 'happytweets.json',
                format: 'json lines'
            },
            {
                alias: 'Angry tweets file',
                filename: 'angrytweets.json',
                format: 'json lines'
            }
        ],
        preprocessors: [
            {
                alias: 'Text preprocessor',
                type: 'Text',
                subtype: 'custom',
                preprocessor_classname: 'TextPreprocessor',
                preprocessor_filename: 'text_preprocessor.py',
                preprocessor_function: 'clean'
            }
        ],
    }
}