import React, { Component } from 'react';
import defaultPipeline from './defaultPipeline';
import API from './API';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Chip from '@material-ui/core/Chip';

const classes = theme => ({
    root: {
        width: '100%',
        },
        heading: {
        fontSize: theme.typography.pxToRem(15),
        },
        secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
        },
        icon: {
        verticalAlign: 'bottom',
        height: 20,
        width: 20,
        },
        details: {
        alignItems: 'center',
        },
        column: {
        flexBasis: '33.33%',
        },
        helper: {
        borderLeft: `2px solid ${theme.palette.divider}`,
        padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
        },
        link: {
        color: theme.palette.primary.main,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        },
        },
});

class TwitterPanel extends Component {
    state = {
        outputs: [
            'Flat File Sentiment Classifier'
        ]
    }

    updateFromEvent = event => {
        this.props.updateFn(this.props.type, this.props.key, event.target.name, event.target.value);
    }

    updateOutputs = event => {
        if (event.key === 'Enter'){
            const newAlias = event.target.value;
            const outputs = this.props.outputs;
            if (outputs.indexOf(newAlias) === -1)
                outputs.push(newAlias);
            this.props.updateFn(this.props.type, this.props.array_position, 'outputs', outputs);
        }
    }

    handleDeleteOutput = output_alias => () => {
        const outputs = this.props.outputs;
        const outputToDelete = outputs.indexOf(output_alias);
        outputs.splice(outputToDelete, 1);
        this.props.updateFn(this.props.type, this.props.array_position, 'outputs', outputs);
    }

    render() {
        return (
            <ExpansionPanel>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div style={{flexBasis: '33.33%'}}>
                        <Typography variant='h6'>Data Source</Typography>
                    </div>
                    <div style={{flexBasis: '33.33%'}}>
                        <Typography variant='h6'>Type: Twitter Streaming</Typography>
                    </div>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <div style={{flexBasis: '33.33%'}}>
                        <Typography>Settings:</Typography>
                        <TextField name='account_alias' label='Account alias' />
                    </div>
                    <div style={{flexBasis: '33.33%'}}>
                        <Typography>Output(s):</Typography>
                        <TextField style={{marginBottom: '15px'}} name='outputs' onKeyPress={this.updateOutputs} label='Output Alias(es)' onChange={this.updateOutput} />
                        {this.props.outputs.map(output_alias => {
                            // TODO: Icons
                            return (
                                <Chip
                                    style={{margin: '5px'}}
                                    key={output_alias}
                                    label={output_alias}
                                    onDelete={this.handleDeleteOutput(output_alias)}
                                />
                            );
                        })}
                    </div>
                    <div style={{flexBasis: '33.33%', borderLeft: '2px solid #ccc', padding: '5px 10px'}}>
                        <Typography variant='caption'>
                            The Twitter Streaming data source reads live tweets directly from Twitter. 
                            You can filter on user handles, hashtags, and key words.
                            Make sure you have you Twitter credentials saved in this system order for this data source to work properly.
                            <br />
                            <a href="/#" style={{textDecoration: 'none'}}>
                            Learn more
                            </a>
                        </Typography>
                    </div>

                </ExpansionPanelDetails>
                <Divider />
                <ExpansionPanelActions>
                    <Button size='small' color='primary'>Save</Button>
                </ExpansionPanelActions>
            </ExpansionPanel>
        );
    }
}

class AddPipeline extends Component {
    constructor(props) {
        super(props);
        this.update = this.update.bind(this);
    }
    
    state = {
        pipeline: defaultPipeline
    }

    api = new API();

    handleSubmit = async () => {
        this.startLoading();
        const successful = await this.api.post('/pipeline', this.state.pipeline);
        if (successful) {
            this.stopLoading();
        }
    }

    update(type, array_position, attribute, value) {
        const tmpState = this.state;
        tmpState.pipeline[type][array_position][attribute] = value;
        this.setState(tmpState);
    }

    startLoading() {
        console.log('Start loading');
    }

    stopLoading() {
        console.log('Done loading');
    }

    render() {
        const dataSources = this.state.pipeline['data_sources'].map((data_source, i) => {
            switch(data_source.type) {
                case 'StreamingAPI':
                    return (<TwitterPanel outputs={data_source.outputs} type={'data_sources'} updateFn={this.update} key={i} array_position={i} />);
                case 'FlatFile':

                    break;
                default:
                    console.error(`Unknown data source type '${data_source.type}'`);
            }
        })
        return (
            <div>
                {dataSources}
                <Button label='Save' onClick={this.handleSubmit} />
            </div>
        );
    }
}

export default AddPipeline;