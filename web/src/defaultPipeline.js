const defaultPipeline = {
    data_sources: [
        {
            type: 'StreamingAPI',
            alias: 'Twitter Streaming API',
            api_key: 'XXX',
            api_secret: 'XXX',
            access_token: 'xxx',
            access_token_secret: 'xxx',
            projection: [
                'text', 'created_at', 'lang'
            ],
            outputs: [
                'Flat File Sentiment Classifier'
            ]
        }
    ],
    models: [
        {
            alias: 'Flat File Sentiment Classifier',
            module_file_path: 'examples/sentiment-analysis/sentiment.py',
            module_classname: 'SentimentClassifier',
            method_name: 'predict',
            output_attribute: 'sentiment_score',
            preprocessor: 'Tweet Preprocessor',
            outputs: [
                'Twitter Sentiment Predictions File'
            ]
        }
    ],
    storage: [
        {
            type: 'File',
            alias: 'Twitter Sentiment Predictions File',
            save_filename: 'sentiment_predictions.json'
        }
    ],
    preprocessors: [
        {
            alias: 'Tweet Preprocessor',
            module_file_path: 'examples/sentiment-analysis/tweet_preprocessor.py',
            module_classname: 'TweetPreprocessor',
            method_name: 'preprocess'
        }
    ],
    messaging: {
        host: 'localhost'
    }
};

export default defaultPipeline;
