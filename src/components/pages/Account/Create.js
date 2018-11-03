import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import WarningIcon from '@material-ui/icons/Warning';
import SuccessIcon from '@material-ui/icons/CheckCircle';

import classNames from 'classnames';

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

class CreateAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountName: '',
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

  createAccount = () => {
    const { accountName } = this.state;
    if(!accountName){
      this.setState({isAlert: true}, ()=>{
        this.showAlert('Account name is required!');
      });
      return;
    }
      
    this.onFinish({message:'Create account is success!'});
  }

  changeAccountName = (e) => {
    this.setState({accountName: e.target.value});
    console.log(e.target.value);
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
      <div className="">
        {showAlert}
        <h1 className="mb-2">Create new account</h1>
        <div><span className="badge badge-pill badge-light">* This is some tips that user need to know</span></div>

        <TextField
          required
          id="accountName"
          label="Account Name"
          className={classes.textField}
          margin="normal"
          variant="outlined"
          value={this.state.accountName}
          onChange={(evt) => this.changeAccountName(evt)}
        />

        <Button variant="contained" size="large" color="primary" className={classes.button} fullWidth
          onClick={() => this.createAccount()}
        >
          <SaveIcon className={classNames(classes.leftIcon, classes.iconSmall)} />
          Create Account
        </Button>
        <Button variant="contained" size="small" color="default" className={classes.button2}
          onClick={() => this.onFinish()}
        >
          Back
        </Button>
      </div>
    );
  }
}

CreateAccount.propTypes = {
  classes: PropTypes.object.isRequired,

};

export default withStyles(styles)(CreateAccount);
