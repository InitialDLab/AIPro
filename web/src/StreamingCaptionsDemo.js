import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { loadStreamingCaptionsDemoData } from './actions/utilActions';
import { connect } from 'react-redux';
import ImageCaptionDemoCard from './ImageCaptionDemoCard';

class StreamingCaptionsDemo extends Component {
    constructor(props) {
        super(props);
        this.props.loadStreamingCaptionsDemoData();
    }

    render() {
        if (this.props.isLoading === true)
            return '';

        let imageCards;
        if ( this.props.images && this.props.images.length > 0) {
            imageCards = this.props.images.map((image, i) => {
                return(
                    <ImageCaptionDemoCard 
                        imageSource={'http://localhost:5000/' + image.download_location}
                        caption={image.caption.caption}
                        key={i} 
                        index={i} />    
                );
            })
        }
        else {
            imageCards = (
                <Typography style={{textAlign: 'center'}}>No images yet! Try again soon.</Typography>
            );
        }

         return (
             <div>
                 <Typography style={{textAlign: 'center', marginTop: '15px'}} variant='h6'>Images and their predicted captions:</Typography>
                 {imageCards}
             </div>
         )
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.isLoading,
        currentUsername: state.currentUser.username,
        images: state.demo.images
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadStreamingCaptionsDemoData: () => dispatch(loadStreamingCaptionsDemoData()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StreamingCaptionsDemo);
