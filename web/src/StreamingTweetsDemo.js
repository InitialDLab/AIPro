import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import { loadStreamingSentimentDemoData } from './actions/utilActions';
import { connect } from 'react-redux';
import { List, ListItem, ListItemText } from '@material-ui/core';

class StreamingTweetsDemo extends Component {
    constructor(props) {
        super(props);
        this.props.loadStreamingSentimentDemoData();
    }

    render() {
        if (this.props.isLoading === true)
            return '';

        let tweets;
        if ( this.props.tweets && this.props.tweets.length > 0) {
            tweets = this.props.tweets.map((tweet, i) => {
                return(
                    <ListItem key={i}>
                        <ListItemText
                            primary={tweet.text}
                            secondary={'Sentiment Score: ' + parseFloat(Math.round(tweet.sent_score * 100) / 100).toFixed(3)}
                        />
                    </ListItem>
                );
            })
        }
        else {
            tweets = (
                <Typography style={{textAlign: 'center'}}>No tweets yet! Try again soon.</Typography>
            );
        }

         return (
             <div>
                 <Typography style={{textAlign: 'center', marginTop: '15px'}} variant='h6'>Tweets and their predicted sentiment scores:</Typography>
                 <List>
                    {tweets}
                 </List>
             </div>
         )
    }
}

const mapStateToProps = state => {
    return {
        isLoading: state.isLoading,
        currentUsername: state.currentUser.username,
        tweets: state.demo.tweets
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadStreamingSentimentDemoData: () => dispatch(loadStreamingSentimentDemoData()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(StreamingTweetsDemo);
