import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { TextField, ListSubheader, List, ListItem, ListItemIcon, ListItemText, Collapse, Button, Snackbar } from '@material-ui/core';

import SaveIcon from '@material-ui/icons/Save';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import WarningIcon from '@material-ui/icons/Warning';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import IconCast from '@material-ui/icons/Cast';
import classNames from 'classnames';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accountName: '',
      showAlert: '',
      isAlert: false,
      open: true,
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

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  showSuccess = (msg) => {
    this.showAlert(msg, 'success');
  }

  Settings = () => {
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
      <div className={classes.root}>
        <List
          component="nav"
          subheader={<ListSubheader component="div">Network</ListSubheader>}
        >
          <ListItem button>
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText inset primary="RPC Servers" secondary="http://127.0.0.1:9334" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <DraftsIcon />
            </ListItemIcon>
            <ListItemText inset primary="Drafts" />
          </ListItem>
          <ListItem button onClick={this.handleClick}>
            <ListItemIcon>
              <InboxIcon />
            </ListItemIcon>
            <ListItemText inset primary="Inbox" />
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText inset primary="Starred" />
              </ListItem>
            </List>
          </Collapse>
        </List>
      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,

};

export default withStyles(styles)(Settings);
