import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import WarningIcon from '@material-ui/icons/Warning';
import SuccessIcon from '@material-ui/icons/CheckCircle';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%"
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    height: '3rem',
  },
  button2: {
    marginTop: '1.5rem',
    width: "25%"
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
});

class AccountSend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toAddress: '',
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

  SendCoin = () => {
    const { toAddress } = this.state;
    if(!toAddress){
      this.setState({isAlert: true}, ()=>{
        this.showAlert('To address is required!');
      });
      return;
    }
      
    this.onFinish({message:'Send is completed!'});
  }

  changeToAddress = (e) => {
    this.setState({toAddress: e.target.value});
  }

  onFinish = (data) => {
    const { onFinish } = this.props;
    
    if (onFinish) {
      onFinish(data);
    }
  }

  render() {
    const { classes } = this.props;
    const { showAlert } = this.state;

    return (
      <div style={{padding: '2rem'}}>
        {showAlert}
        <div><span className="badge badge-pill badge-light">* Only send CONSTANT to an CONSTANT address.</span></div>

        <TextField
          required
          id="from"
          label="From"
          className={classes.textField}
          margin="normal"
          variant="outlined"
          value={this.state.toAddress}
          onChange={(evt) => this.changeToAddress(evt)}
        />

        <TextField
          required
          id="to"
          label="To"
          className={classes.textField}
          margin="normal"
          variant="outlined"
          value={this.state.toAddress}
          onChange={(evt) => this.changeToAddress(evt)}
        />

        <TextField
          required
          id="amount"
          label="Amount"
          className={classes.textField}
          margin="normal"
          variant="outlined"
          value={this.state.toAddress}
          onChange={(evt) => this.changeToAddress(evt)}
        />

        <Button variant="contained" size="large" color="primary" className={classes.button} fullWidth
          onClick={() => this.SendCoin()} >
            Send
        </Button>
      </div>
    );
  }
}

AccountSend.propTypes = {
  classes: PropTypes.object.isRequired,

};

export default withStyles(styles)(AccountSend);
