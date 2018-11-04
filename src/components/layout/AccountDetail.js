import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Divider, List, ListItemText, ListItemSecondaryAction, ListItem , Avatar, Button} from '@material-ui/core';
import { Gradient, Work, Face, VpnKey } from '@material-ui/icons';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
});

class AccountDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: props.account,
    }
  }

  onFinish = (data) => {
    const { onFinish } = this.props;
    
    if (onFinish) {
      onFinish(data);
    }
  }

  render() {
    const { classes } = this.props;
    const { account } = this.state
    
    return (
      <div className={classes.root}>
        <List>
          <ListItem>
            <Avatar>
              <Face />
            </Avatar>
            <ListItemText primary="Name" secondary={account.name} />
          </ListItem>
          <Divider />

          <ListItem>
            <Avatar>
              <Gradient />
            </Avatar>
            <ListItemText primary="Address" secondary="12345" />
          </ListItem>
          <Divider />

          <ListItem>
            <Avatar>
              <Work />
            </Avatar>
            <ListItemText primary="Balance" secondary={account.value} />
          </ListItem>
          <Divider />

          <ListItem>
            <Avatar>
              <VpnKey />
            </Avatar>
            <ListItemText primary="Sealer Keyset" secondary={"<hide>"} />
            <ListItemSecondaryAction>
            <Button variant="contained" size="small" color="primary" className={classes.button2}
                onClick={() => this.onFinish()} >
                Export
              </Button>
            </ListItemSecondaryAction>
          </ListItem>
          
          
          
        </List>
      </div>
    );
  }
}

AccountDetail.propTypes = {
  classes: PropTypes.object.isRequired,

};

export default withStyles(styles)(AccountDetail);
