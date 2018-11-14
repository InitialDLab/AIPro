import React, { Component } from 'react';
import FlatFileStorageForm from './FlatFileStorageForm';
import FilterForm from './FilterForm';

class PipelineSidebar extends Component {
    
    
    render() {
        let form = '';
        switch(this.props.formType) {
            case 'flat_file_storage':
                form = (
                    <FlatFileStorageForm 
                        alias={this.props.alias} 
                        filename={this.props.filename} 
                        filetype={this.props.filetype}
                        handleSave={this.props.handleSave}
                    />
                );
                break;
            case 'filter':
                form = (
                    <FilterForm
                        alias={this.props.alias}
                        comparison={this.props.comparison}
                        value={this.props.value}
                        save={this.props.save}
                    />
                );
                break;
            default:
                form = '';
                break;
        }
        return (
            <div style={{width: '250px', height: '100vh', position: 'absolute'}}>
                {form}
            </div>
        )
    }
}

export default PipelineSidebar;
