import React, { Component } from 'react';
import { FormControl, Typography} from '@material-ui/core';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import TwitterStreamingAPIForm from './forms/TwitterStreamingAPIForm';
import FlatFileDataSourceForm from './forms/FlatFileDataSourceForm';
import FilterForm from './forms/FilterForm';
import CustomModelForm from './forms/CustomModelForm';
import APIModelForm from './forms/APIModelForm';
import CustomEntityForm from './forms/CustomEntityForm';
import PrebuiltModelForm from './forms/PrebuiltModelForm';
import FlatFileStorageForm from './forms/FlatFileStorageForm';
import MongoDBForm from './forms/MongoDBForm';

const styles = theme => ({
    root: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
});

class ModuleDetails extends Component {
    state = {
        attrs: this.props.attrs
    };

    handleChange = event => {
        this.setState({...this.state, [event.target.name]: event.target.value});
    }

    getForm(formType) {
        switch(formType) {
            case 'FlatFileDataSource':
                return <FlatFileDataSourceForm alias={this.props.attrs.alias} filename={this.props.attrs.filename} />;
            case 'TwitterStreamingAPI':
                return <TwitterStreamingAPIForm alias={this.props.attrs.alias} />;
            case 'FlatFileStorage':
                return <FlatFileStorageForm alias={this.props.attrs.alias} filename={this.props.attrs.filename} />
            case 'CustomModel':
                return <CustomModelForm 
                            alias={this.props.attrs.alias}
                            module_file_path={this.props.attrs.module_file_path}
                            module_classname={this.props.attrs.module_classname}
                            method_name={this.props.attrs.method_name}
                            input_attribute={this.props.attrs.input_attribute}
                            output_attribute={this.props.attrs.output_attribute}
                            preprocessor={this.props.attrs.preprocessor}
                        />;
            case 'APIModel':
                return <APIModelForm
                            alias={this.props.attrs.alias}
                            input_attribute={this.props.attrs.input_attribute}
                            output_attribute={this.props.attrs.output_attribute}
                            endpoint={this.props.attrs.endpoint}
                            http_method={this.props.attrs.http_method}
                            image_location_attr={this.props.attrs.image_location_attr}
                        />;
            case 'CustomEntity':
                return <CustomEntityForm
                            alias={this.props.attrs.alias}
                            input_attribute={this.props.attrs.input_attribute}
                            output_attribute={this.props.attrs.output_attribute}
                            filename={this.props.attrs.filename}
                            function={this.props.attrs.function}
                        />;
            case 'PrebuiltModel':
                return <PrebuiltModelForm alias={this.props.attrs.alias} subtype={this.props.attrs.subtype} />
            case 'Filter':
                return <FilterForm
                            alias={this.props.attrs.alias}
                            attribute={this.props.attrs.attribute}
                            condition={this.props.attrs.condition}
                            value={this.props.attrs.value}
                        />;
            case 'MongoDB':
                return <MongoDBForm 
                            alias={this.props.attrs.alias} 
                            host={this.props.attrs.host}
                            port={this.props.attrs.port}
                            db={this.props.attrs.db}
                            collection={this.props.attrs.collection}
                        />;
            default:
                return `No support yet for form type ${formType}`;
        }
    }

    getFormTitle(formType) {
        switch(formType) {
            case 'FlatFileDataSource':
                return 'Flat File (Data Source)';
            case 'TwitterStreamingAPI':
                return 'Twitter Streaming API';
            case 'FlatFileStorage':
                return 'Flat File (Storage)';
            case 'CustomModel':
                return 'Custom Model';
            case 'APIModel':
                return 'API Model';
            case 'CustomEntity':
                return 'Custom Entity';
            case 'PrebuiltModel':
                return 'Prebuilt Model';
            case 'Filter':
                return 'Filter';
            case 'MongoDB':
                return 'MongoDB';
            default:
                return 'Other';
        }
    }

    render() {
        let { classes } = this.props;
        const form = this.props.attrs ? this.getForm(this.props.attrs.type) : '';
        const moduleType = this.props.attrs ? this.getFormTitle(this.props.attrs.type) : 'Other';
        return(
            <FormControl className={classes.root}>
                <Typography variant='h6'>
                    Module Details
                </Typography>
                <Typography variant='subtitle1'>
                    Type: {moduleType}
                </Typography>
                {form}
            </FormControl>
        )
    }
}

const mapStateToProps = state => {
    const currentModule = state.currentModule;
    const index = currentModule.index;
    const category = currentModule.category;
    const pipeline = state.currentPipeline;
    const attrs = pipeline[category][index];
    
    return {
        attrs
    }
};
const mapDispatchToProps = null;
export default withStyles(styles)(
connect(
    mapStateToProps,
    mapDispatchToProps
)(ModuleDetails));
