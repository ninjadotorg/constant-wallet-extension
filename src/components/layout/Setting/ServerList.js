import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Paper, CircularProgress } from '@material-ui/core';

import { Star as IconStar } from '@material-ui/icons';
import Server from '../../../services/Server';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 5,
  },
  button: {
    margin: theme.spacing.unit
  },
  progress: {
    position: 'absolute',
    left: 'calc(50% - 25px)',
    top: '10rem'
  },
});

class ServerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serverSelected: false,
      servers: [],
      loading: false,
    }
  }

  componentDidMount(){
    this.getSettingServers();
  }

  async getSettingServers(){
    this.setState({loading: true, servers: []});
    const servers = await Server.getList();
    this.setState({loading: false, servers});
  }

  render() {
    const { classes } = this.props;
    const { loading, servers } = this.state;

    return (
      <div>
        { servers.length > 0 &&
          <Paper className={classes.root} elevation={1} style={{padding: "0px 10px"}}>
            <List component="nav">
              {
                servers.map(a => {
                  return (
                <ListItem button key={Math.random()} onClick={()=> this.openAccountDetail(a)}>
                  <ListItemIcon>
                    {a.default ? <IconStar className="text-primary" /> : <span className="emptyIcon" />}
                  </ListItemIcon>
                  <ListItemText inset primary={a.name} />
                  <ListItemSecondaryAction className="badge badge-secondary badge-pill">
                    {Number(a.value) / 1000}
                  </ListItemSecondaryAction>
                </ListItem>)
                })
              }
            </List>
          </Paper>
        }
        {
          !loading && servers.length <= 0 && <div className="text-center">
            {/* <img src={img1} alt="" /> */}
            <h3 className="text-secondary mt-3">Not found your account(s)</h3>
          </div> 
        }
        {
          loading && <CircularProgress className={classes.progress} color="secondary" />
        }
      </div>
    );
  }
}

ServerList.propTypes = {
  classes: PropTypes.object.isRequired,

};

export default withStyles(styles)(ServerList);

