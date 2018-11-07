import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { AppBar, IconButton, SwipeableDrawer, Toolbar, Divider, Typography, ListItem, List, ListItemIcon, ListItemText, MenuItem, Menu  } from '@material-ui/core';

import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import IconInfo from '@material-ui/icons/Info';
import IconSettings from '@material-ui/icons/Settings';
import IconFullScreen from '@material-ui/icons/Fullscreen';
import { ExitToApp as IconExitToApp, Home as IconHome } from '@material-ui/icons';

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
      left: false
    }
    
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
        <ListItem button key="expandView">
          <ListItemIcon><IconFullScreen /></ListItemIcon>
          <ListItemText primary="Expand View" />
        </ListItem>
        <ListItem button key="ninjaConstant">
          <ListItemIcon><IconExitToApp /></ListItemIcon>
          <ListItemText primary="View on Constant Explorer" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button key="info">
          <ListItemIcon><IconInfo /></ListItemIcon>
          <ListItemText primary="Info & Help" />
        </ListItem>
        <ListItem button key="settings" onClick={() => this.selectMenu('SETTINGS')}>
          <ListItemIcon><IconSettings /></ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </div>
    );
  }
  render() {
    const { classes, title } = this.props;
    const { auth, anchorEl } = this.state;
    const open = Boolean(anchorEl);

    return (
      <div className={classes.root}>
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
                  <MenuItem onClick={() => this.selectMenu('CREATE_ACCOUNT')}>Create Account</MenuItem>
                  <MenuItem onClick={() => this.selectMenu('IMPORT_ACCOUNT')}>Import Account</MenuItem>
                </Menu>
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
