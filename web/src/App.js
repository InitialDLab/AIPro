import React, { Component } from 'react';
import './App.css';
import Header from './Header';
import AddPipeline from './AddPipeline';
import { BrowserRouter as Router, Route, Redirect} from 'react-router-dom'
import Settings from './Settings';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import AllPipelines from './AllPipelines';
import { connect } from 'react-redux';
import { setLoggedIn, CLEAR_ERROR, CLEAR_MESSAGE } from './actions/utilActions';
import { CookiesProvider, withCookies } from 'react-cookie';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

class App extends Component {
  constructor(props) {
    super(props);
    const currentUserCookie = this.props.cookies.get('current_user') || '';
    if (currentUserCookie !== '')
      this.props.setLoggedIn(true);
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

    return (
      <CookiesProvider>
        <Router>
          <div style={{width: '100%', height: '100%'}}>
            <Header />
            <Route exact path='/' render={() => 
              this.props.loggedIn ? 
              <AddPipeline /> 
              : <Redirect to='/login' />} 
              />
            <Route path='/settings' render={() => 
              this.props.loggedIn ? 
              <Settings currentUser={this.props.currentUser} /> 
              : <Redirect to='/login' />}
              />
            <Route exact path='/pipelines/new' render={() => 
              this.props.loggedIn ? 
              <AddPipeline /> 
              : <Redirect to='/login' />}
              />
            <Route exact path='/pipelines' render={() => 
              this.props.loggedIn ? 
              <AllPipelines username={this.props.currentUser} /> 
              : <Redirect to='/login' />} 
              />
            <Route path='/login' render={() => <LoginPage />} 
            />
            <Route path='/signup' render={() => 
              this.props.loggedIn ?
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
      </CookiesProvider>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    loggedIn: state.loggedIn,
    currentUser: state.currentUser.username,
    message: state.message,
    errorMessage: state.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLoggedIn,
    closeSnackbar: (typeOfMessage) => {
      if (typeOfMessage === 'errorMessage')
        dispatch(CLEAR_ERROR); 
      else if(typeOfMessage === 'message')
        dispatch(CLEAR_MESSAGE);
    }
  }
}

export default withCookies(connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
);
