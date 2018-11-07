import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import Dialog from '../core/Dialog'
import ServerList from '../layout/Setting/ServerList';
import ServerAdd from '../layout/Setting/ServerAdd';

import { Tooltip, ListSubheader, List, ListItem, ListItemIcon, ListItemText, Collapse, Button, Snackbar } from '@material-ui/core';

import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import WarningIcon from '@material-ui/icons/Warning';
import SuccessIcon from '@material-ui/icons/CheckCircle';
import { Add as IconAdd } from '@material-ui/icons';

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
      modalServerList: '',
      modalServerAdd: '',
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

  openServerAdd = (account) => {
    //this.modalAccountDetailRef.close();
    this.setState({//modalAccountDetail: '',
      modalServerAdd: <ServerAdd  />
    });
    this.modalServerAddRef.open();
  }

  get serverButtonAction(){
    const { classes } = this.props;
    
    return (<div>
      <Tooltip title="Add Server">
        <Button mini variant="fab" color="secondary" className={classes.button} aria-label="Add Server" onClick={() => this.openServerAdd()}>
          <IconAdd />
        </Button>
      </Tooltip>
    </div>
    );
  }

  openServerList = () => {
    this.setState({
      modalServerList: <ServerList />
    });
    this.modalServerListRef.open();
  }

  render() {
    const { classes } = this.props;
    const { showAlert, modalServerList, modalServerAdd } = this.state;

    return (
      <div className={classes.root}>
        {showAlert}
        <List
          component="nav"
          subheader={<ListSubheader component="div">Network</ListSubheader>}
        >
          <ListItem button onClick={() => this.openServerList()}>
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

        <Dialog title="Servers" onRef={modal => this.modalServerListRef = modal} className={{margin: 0}} buttonAction={this.serverButtonAction}>
          {modalServerList}
        </Dialog>

        <Dialog title="Add Server" onRef={modal => this.modalServerAddRef = modal} className={{margin: 0}}>
          {modalServerAdd}
        </Dialog>
      </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,

};

export default withStyles(styles)(Settings);
