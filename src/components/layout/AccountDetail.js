import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import WarningIcon from '@material-ui/icons/Warning';

import classNames from 'classnames';

const styles = theme => ({
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "100%"
  },
  button: {
    margin: theme.spacing.unit,
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

class AccountDetail extends React.Component {
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


  showAlert = (msg) => {
    let showAlert = <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={this.state.isAlert}
      autoHideDuration={3000}
      onClose={this.handleClose}
    >
      <div className="alert alert-warning" role="alert"><WarningIcon /> {msg}</div>
    </Snackbar>
    this.setState({showAlert});
  }
  AccountDetail = () => {
    const { accountName } = this.state;
    if(!accountName){
      this.setState({isAlert: true}, ()=>{
        this.showAlert('Account name is required!');
      });
      return;
    }
      
    this.onFinish();
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
        <h1>Create new account</h1>

      </div>
    );
  }
}

AccountDetail.propTypes = {
  classes: PropTypes.object.isRequired,

};

export default withStyles(styles)(AccountDetail);
