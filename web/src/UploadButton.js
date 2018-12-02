import React from 'react';
import Button from '@material-ui/core/Button';

const UploadButton = (props) => {
    return (
        <div>
            <input
                hidden
                accept="file/*"
                name='file'
                id="raised-button-file"
                multiple
                type="file"
                onChange={props.handleFile}
            />
            <label htmlFor="raised-button-file">
                <Button variant='outlined' color='default' component="span" >
                    {props.buttonText}
                </Button>
            </label> 
        </div>
    );
}

export default UploadButton;