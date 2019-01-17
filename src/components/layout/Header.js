import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { AppBar, IconButton, SwipeableDrawer, Toolbar, 
  Divider, Typography, ListItem, List, Snackbar,
  ListItemIcon, ListItemText, MenuItem, Menu } from '@material-ui/core';

import { ExitToApp as IconExitToApp, Home as IconHome,
  Fullscreen as IconFullScreen, Settings as IconSettings,
  Info as IconInfo, AccountCircle, Menu as MenuIcon, 
  Error as IconError, CheckCircle as IconSuccess, Warning as IconWarning } from '@material-ui/icons';


import AccountList from '../layout/Account/List'

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: true,
      anchorEl: null,
      title: props.title,
      left: false,
      showAlert: '',
      isAlert: false,
    }
    
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ showAlert: '', isAlert: false });
  }

  showAlert = (msg, {flag='warning', html=false, duration=2000, hideIcon=false}) => {
    let showAlert = '', isAlert = true, icon = '';

    if(flag === 'success')
      icon = <IconSuccess />;
    else if(flag === 'danger')
      icon = <IconError />;
      else if(flag === 'warning')
      icon = <IconWarning />;

    this.setState({isAlert}, ()=> {
      showAlert = <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isAlert}
        autoHideDuration={duration}
        onClose={this.handleClose}
      >
        <div className={"alert alert-"+flag} role="alert">{!hideIcon && icon} {msg}</div>
      </Snackbar>

      this.setState({showAlert});
    });
  }

  showSuccess = (msg) => {
    this.showAlert(msg, {flag: 'success', duration: 3000, hideIcon: true});
  }

  showWarning = (msg) => {
    this.showAlert(msg, {flag: 'warning'});
  }

  showError = (msg) => {
    this.showAlert(msg, {flag: 'danger'});
  }

  showInfo = (msg) => {
    this.showAlert(msg, {flag: 'info', duration: 3000, hideIcon: true});
  }

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  handleChange = event => {
    this.setState({ auth: event.target.checked });
  };

  handleMenu = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  selectMenu = (menu) => {
    const { callbackSelected } = this.props;

    this.setState({ anchorEl: null }, ()=> {
      if (callbackSelected) {
        callbackSelected(menu);
      }
    });
    
  }

  get sideList(){
    const { classes } = this.props;

    return (<div className={classes.list}>
      <List>
        <ListItem button key="home" onClick={() => this.selectMenu('HOME')}>
          <ListItemIcon><IconHome /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key="expandView" onClick={() => this.showInfo('Not finish!')}>
          <ListItemIcon><IconFullScreen /></ListItemIcon>
          <ListItemText primary="Expand View" />
        </ListItem>
        <ListItem button key="ninjaConstant" onClick={() => this.showInfo('Not finish!')}>
          <ListItemIcon><IconExitToApp /></ListItemIcon>
          <ListItemText primary="View on Constant Explorer" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key="info" onClick={() => this.showInfo('Not finish!')}>
          <ListItemIcon><IconInfo /></ListItemIcon>
          <ListItemText primary="Info & Help" />
        </ListItem>
        <ListItem button key="settings" onClick={() => this.selectMenu('SETTINGS')} >
          <ListItemIcon><IconSettings /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </div>
    );
  }
  renderAccountList = () => {
    return (
      <AccountList />

    );
  }
  renderMenu = () => {
    const { anchorEl } = this.state;
    const open = Boolean(anchorEl);
    return (
      <Menu
      id="menu-appbar"
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={open}
      onClose={this.handleClose}
    >
      {this.renderAccountList()}
      <MenuItem onClick={() => this.selectMenu('CREATE_ACCOUNT')}>Create Account</MenuItem>
      <MenuItem onClick={() => this.selectMenu('IMPORT_ACCOUNT')}>Import Account</MenuItem>
    </Menu>
    );
  }
  render() {
    const { classes, title } = this.props;
    const { auth, anchorEl, showAlert } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
        {showAlert}
        <AppBar position="static">
          <Toolbar>
            <IconButton className={classes.menuButton} color="inherit" aria-label="Menu">
              <MenuIcon onClick={this.toggleDrawer('left', true)} />
            </IconButton>
            <Typography variant="h6" color="inherit" className={classes.grow}>
              {title}
            </Typography>
            {auth && (
              <div>
                <IconButton
                  aria-owns={open ? 'menu-appbar' : undefined}
                  aria-haspopup="true"
                  onClick={this.handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                {this.renderMenu()}
              </div>
            )}
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
          open={this.state.left}
          onClose={this.toggleDrawer('left', false)}
          onOpen={this.toggleDrawer('left', true)}
        >
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            {this.sideList}

          </div>
        </SwipeableDrawer>
      </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Header);;
