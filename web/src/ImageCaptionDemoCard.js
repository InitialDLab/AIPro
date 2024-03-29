import React, { Component } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActionArea from '@material-ui/core/CardActionArea';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

const styles = theme => ({
    imageCard: {
        ...theme.mixins.gutters(),
        width: '300px',
        display: 'inline-block',
        margin: theme.spacing.unit * 2
    },
    media: {
        height: 300,
    },
});

class ImageCaptionDemoCard extends Component {
    render() {
        if (this.props.isLoading) {
            return '';
        }
        
        const { classes } = this.props;

        return (
            <Card className={classes.imageCard}>
                <CardActionArea>
                    <CardMedia 
                        className={classes.media}
                        image={this.props.imageSource}
                        title={this.props.caption}
                    />
                    <CardContent>
                        
                        <Typography variant='caption'>
                            Fig ({this.props.index + 1}): {this.props.caption}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        )
    }
}

const mapStateToProps = state => {
    return {isLoading: state.isLoading};
}

const mapDispatchToProps = dispatch => {
    return {};
}

export default withStyles(styles)(
connect(
    mapStateToProps,
    mapDispatchToProps
)(ImageCaptionDemoCard));
