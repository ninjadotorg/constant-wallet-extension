import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Divider, List, ListItemText, ListItemSecondaryAction, ListItem , Avatar, Button} from '@material-ui/core';

import ImageIcon from '@material-ui/icons/Image';
import WorkIcon from '@material-ui/icons/Work';
import BeachAccessIcon from '@material-ui/icons/BeachAccess';

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
console.log(account);
    return (
      <div className={classes.root}>
        <List>
          <ListItem>
            <Avatar>
              <BeachAccessIcon />
            </Avatar>
            <ListItemText primary="Name" secondary={account.name} />
          </ListItem>
          <Divider />

          <ListItem>
            <Avatar>
              <ImageIcon />
            </Avatar>
            <ListItemText primary="Address" secondary="12345" />
          </ListItem>
          <Divider />

          <ListItem>
            <Avatar>
              <WorkIcon />
            </Avatar>
            <ListItemText primary="Balance" secondary={account.value} />
          </ListItem>
          <Divider />

          <ListItem>
            <Avatar>
              <WorkIcon />
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
