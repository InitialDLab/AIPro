import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import Pipeline from './Pipeline';
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Settings from './Settings';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import ManagePipelines from './ManagePipelines';
import StreamingCaptionsDemo from './StreamingCaptionsDemo';
import StreamingTweetsDemo from './StreamingTweetsDemo';
import { connect } from 'react-redux';
import { setLoggedIn, CLEAR_ERROR, CLEAR_MESSAGE, loadCredentials } from './actions/utilActions';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import { purple } from '@material-ui/core/colors/';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: blue,
  },
  typography: {
    useNextVariants: true
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    const account_type = 'twitter';
    props.loadCredentials(props.currentUsername, account_type);
  }
  
  handleSnackbarClose = event => {
    if (this.props.message)
      this.props.closeSnackbar('message');
    else if(this.props.errorMessage)
      this.props.closeSnackbar('errorMessage');
  }

  render() {
    let isOpen;
    if (this.props.message || this.props.errorMessage)
      isOpen = true;
    else
      isOpen = false;

    const loggedIn = true; // this.props.loggedIn;
    return (
      <MuiThemeProvider theme={theme}>
        <Router>
          <div style={{width: '100%', height: '100%'}}>
            <Header />
            <Route exact path='/' render={() => 
              loggedIn ? 
              <Redirect to='/pipelines' />
              : <Redirect to='/login' />} 
              />
            <Route path='/settings' render={() => 
              loggedIn ? 
              <Settings /> 
              : <Redirect to='/login' />}
              />
            <Route exact path='/pipeline/edit' render={() =>
              loggedIn ?
              <Pipeline />
              : <Redirect to='/login' />}
            />
            <Route exact path='/pipeline/new/batch' render={() => 
              loggedIn ? 
              <Pipeline new={true} type='batch' /> 
              : <Redirect to='/login' />}
            />
            <Route exact path='/pipeline/new/streaming' render={() => 
              loggedIn ? 
              <Pipeline new={true} type='streaming' /> 
              : <Redirect to='/login' />}
            />
            <Route exact path='/pipeline/new/streaming-images' render={() => 
              loggedIn ? 
              <Pipeline new={true} type='streaming-images' /> 
              : <Redirect to='/login' />}
            />
            <Route exact path='/pipelines' render={() => 
              loggedIn ? 
              <ManagePipelines /> 
              : <Redirect to='/login' />} 
              />
            <Route exact path='/demo/captions' render={() => 
              loggedIn ?
              <StreamingCaptionsDemo />
              : <Redirect to='/login' />}
            />
            <Route exact path='/demo/tweets' render={() => 
              loggedIn ?
              <StreamingTweetsDemo />
              : <Redirect to='/login' />}
            />
            <Route path='/login' render={() => <LoginPage />} 
            />
            <Route path='/signup' render={() => 
              loggedIn ?
              <Redirect to='/' />
              : <SignupPage />}
              />
              <Snackbar 
                open={isOpen}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center'
                }}
                onClose={this.handleSnackbarClose}
                message={this.props.message || this.props.errorMessage}
                action={[
                  <IconButton
                  key='close'
                  aria-label='Close'
                  color='inherit'
                  style={{padding: '10px'}}
                  onClick={this.handleSnackbarClose}
                  >
                    <CloseIcon />
                  </IconButton>
                ]}
              />
          </div>
        </Router>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = state => {
  return {
    loggedIn: state.loggedIn,
    message: state.message,
    errorMessage: state.error,
    currentUsername: state.currentUser.username,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    loadCredentials: (username, account_type) => dispatch(loadCredentials(username, account_type)),
    setLoggedIn: loggedIn => dispatch(setLoggedIn(loggedIn)),
    closeSnackbar: typeOfMessage => {
      if (typeOfMessage === 'errorMessage')
        dispatch(CLEAR_ERROR); 
      else if(typeOfMessage === 'message')
        dispatch(CLEAR_MESSAGE);
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
