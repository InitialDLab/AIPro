import React, { Component } from 'react';
import { TextField, Select, MenuItem, InputLabel, FormControl } from '@material-ui/core';
import { connect } from 'react-redux';
import { updateModule, updateOutput } from '../actions/pipelineActions';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 120,
    },
    select: {
        paddingTop: theme.spacing.unit * 2,
    },
    selectLabel: {
        paddingTop: theme.spacing.unit * 2,
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
  });

  const models = {
      'VGG': {
          model_path: 'model/vgg16.onnx',
          module_file_path: 'examples/image-classification/inference.py',
          module_classname: 'ImageClassifier',
          method_name: 'predict',
          preprocessor_filename: 'examples/image-classification/preprocess.py',
          preprocessor_classname: 'ImagePreprocessor',
          preprocessor_method_name: 'preprocess',
          output_attribute: 'vgg_prediction',
          type: 'PrebuiltModel'
      },
      'MobileNet': {
        model_path: 'model/mobilenetv2-1.0.onnx',
        module_file_path: 'examples/image-classification/inference.py',
        module_classname: 'ImageClassifier',
        method_name: 'predict',
        preprocessor_filename: 'examples/image-classification/preprocess.py',
        preprocessor_classname: 'ImagePreprocessor',
        preprocessor_method_name: 'preprocess',
        output_attribute: 'mobilenet_prediction',
        type: 'PrebuiltModel'
    },
    'ResNet': {
        model_path: 'model/resnet18v2.onnx',
        module_file_path: 'examples/image-classification/inference.py',
        module_classname: 'ImageClassifier',
        method_name: 'predict',
        preprocessor_filename: 'examples/image-classification/preprocess.py',
        preprocessor_classname: 'ImagePreprocessor',
        preprocessor_method_name: 'preprocess',
        output_attribute: 'resnet_prediction',
        type: 'PrebuiltModel'
    },
    'SqueezeNet': {
        model_path: 'model/squeezenet1.1.onnx',
        module_file_path: 'examples/image-classification/inference.py',
        module_classname: 'ImageClassifier',
        method_name: 'predict',
        preprocessor_filename: 'examples/image-classification/preprocess.py',
        preprocessor_classname: 'ImagePreprocessor',
        preprocessor_method_name: 'preprocess',
        output_attribute: 'squeezenet_prediction',
        type: 'PrebuiltModel'
    },
    'SentimentAnalysis': {
        module_file_path: 'examples/sentiment-analysis/sentiment.py',
        module_classname: 'SentimentClassifier',
        method_name: 'predict',
        input_attribute: 'text',
        output_attribute: 'sent_score',
        preprocessor_filename: 'examples/sentiment-analysis/tweet_preprocessor.py',
        preprocessor_classname: 'TweetPreprocessor',
        preprocessor_method_name: 'preprocess',
        type: 'PrebuiltModel'
    }
  }

class PrebuiltModelForm extends Component {
    handleChange = event => {
        const attribute = event.target.name, value = event.target.value;
        
        if (value === '') return;
        
        this.props.updateModule(this.props.category, this.props.index, attribute, value);
        if (attribute === 'subtype'){
            const subtype = value;
            const model_config = models[subtype];
            for (let key of Object.keys(model_config)) {
                this.props.updateModule(this.props.category, this.props.index, key, model_config[key]);
            }
        }

        //this.props.updateModule('models', this.props.index, attribute, value);
        if (attribute === 'alias') {
            this.props.updateOutput(this.props.parentCategory, this.props.parentIndex, this.props.parentOutputIndex, value);
        }
    }
    
    render() {
        const { classes } = this.props;

        return (
            <FormControl className={classes.formControl}>
                <TextField label='Alias' name='alias' value={this.props.alias} onChange={this.handleChange} />
                
                <Select 
                    inputProps={{
                        name: 'subtype',
                        id: 'model-selector',
                    }}
                    value={this.props.subtype} onChange={this.handleChange} 
                >
                    <MenuItem className={classes.selectEmpty} value=''>Prebuilt Model</MenuItem>
                    <MenuItem value='VGG'>VGG</MenuItem>
                    <MenuItem value='SqueezeNet'>SqueezeNet</MenuItem>
                    <MenuItem value='MobileNet'>MobileNet</MenuItem>
                    <MenuItem value='ResNet'>ResNet</MenuItem>
                    <MenuItem value='SentimentAnalysis'>Text Sentiment</MenuItem>
                </Select>
            </FormControl>
        )
    }
}

const mapStateToProps = state => {
    return Object.assign({}, state.currentModule);
}

const mapDispatch = dispatch => {
    return {
        updateModule: (type, index, attribute, value) => dispatch(updateModule(type, index, attribute, value)),
        updateOutput: (parentCategory, parentIndex, parentOutputIndex, outputAlias) => dispatch(updateOutput(parentCategory, parentIndex, parentOutputIndex, outputAlias)),
    }
}
export default withStyles(styles)(connect(
    mapStateToProps,
    mapDispatch
)(PrebuiltModelForm));
