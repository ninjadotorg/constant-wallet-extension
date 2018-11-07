import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, Divider, CircularProgress } from '@material-ui/core';

import { Star as IconStar } from '@material-ui/icons';
import Server from '../../../services/Server';

const styles = theme => ({
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

  openServerDetail = () => {

  }

  render() {
    const { classes } = this.props;
    const { loading, servers } = this.state;

    return (
      <div>
        { 
          servers.map(s => {
          return (
            <List component="nav">
              <ListItem button key={Math.random()} onClick={()=> this.openServerDetail(s)}>
                <ListItemIcon>
                  {s.default ? <IconStar className="text-primary" /> : <span className="emptyIcon" />}
                </ListItemIcon>
                <ListItemText inset primary={s.name ? s.name : s.address} />
              </ListItem>
              <Divider />
            </List>)
          })
        }
        {
          !loading && servers.length <= 0 && <div className="text-center">
            {/* <img src={img1} alt="" /> */}
            <h3 className="text-secondary mt-3">Not found server(s)</h3>
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

