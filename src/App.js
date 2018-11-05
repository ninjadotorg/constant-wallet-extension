import React, { Component } from 'react';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.css';
import Header from './components/layout/Header';
import Home from './components/pages/Home';
import CreateAccount from './components/pages/Account/Create';
import Settings from './components/pages/Settings';
import ImportAccount from './components/pages/Account/Import';
import Snackbar from '@material-ui/core/Snackbar';
import WarningIcon from '@material-ui/icons/Warning';
import SuccessIcon from '@material-ui/icons/CheckCircle';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#6396ef',
      main: '#2469bc',
      dark: '#003f8b',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffe46e',
      main: '#fdb23c',
      dark: '#c58300',
      contrastText: '#000',
    },
    third: {
      light: '#ff6333',
      main: '#ff3d00',
      dark: '#b22a00',
      contrastText: '#000',
    }
  },
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screen: <Home />,
      headerTitle: 'Wallet home',
      showAlert: '',
      isAlert: false,
    }
    
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ showAlert: '', isAlert: false });
  };

  selectAccount = (action) => {
    let screen = '', headerTitle = 'Home';
    if(action === 'CREATE_ACCOUNT'){
      screen = <CreateAccount onFinish={(data) => { this.backHome(data); }} />;
      headerTitle = 'Account';
    }
    else if(action === 'IMPORT_ACCOUNT'){
      screen = <ImportAccount onFinish={(data) => { this.backHome(data); }} />;
      headerTitle = 'Account';
    }
    else if(action === 'SETTINGS'){
      screen = <Settings onFinish={(data) => { this.backHome(data); }} />;
      headerTitle = 'Settings';
    }
    else{
      screen = <Home />;
    }

    this.setState({screen, headerTitle});
  }
  
  showAlert = (msg, flag='warning') => {
    let showAlert = '', isAlert = true, icon = <WarningIcon />;

    if(flag === 'success')
      icon = <SuccessIcon />;

    this.setState({isAlert}, ()=> {
      showAlert = <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isAlert}
        autoHideDuration={3000}
        onClose={this.handleClose}
      >
        <div className={"alert alert-"+flag} role="alert">{icon} {msg}</div>
      </Snackbar>

      this.setState({showAlert});
    });
  }

  showSuccess = (msg) => {
    this.showAlert(msg, 'success');
  }

  backHome = (data) => {
    console.log(data);
    this.setState({screen: <Home />, headerTitle: 'Home'});

    if(data && data.message){
      this.showSuccess(data.message);
    }
      
  }

  render() {
    const { screen, headerTitle, showAlert } = this.state;

    return (
      <div className="App">
        {showAlert}
        <MuiThemeProvider theme={theme}>
          <Header 
            callbackSelected={(action) => { this.selectAccount(action) }}
            title={headerTitle}
          />
          <div className="container">
            {screen}
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default App;
