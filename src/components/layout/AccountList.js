import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import StarIcon from '@material-ui/icons/Star';
import Paper from '@material-ui/core/Paper';
import Dialog from '../core/Dialog'
import img1 from '../../assets/images/img1.png'

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    ...theme.mixins.gutters(),
    marginTop: theme.spacing.unit * 5,
  },
});

class AccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      walletName: '',
      accountList: [],
      modalAccountDetail: ''
    }
    
  }

  async componentDidMount(){
    const result = await this.getAccountList();
    if(result){
      const accounts = result.Accounts, walletName = result.WalletName;
      let accountList = [];

      Object.keys(accounts).forEach(a => { 
        accountList.push({default: false, name: a, value: accounts[a]});
      });

      if(accountList.length > 0)
        accountList[0].default = true;

      this.setState({walletName, accountList})
    }
  }

  async getAccountList() {

    const url = "http://127.0.0.1:9334",
      username = '', 
      password = '';

    const auth = "Basic " + new Buffer(username+':'+password).toString('base64');
    const options = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': auth
      },
      url,
      data: {"jsonrpc":"1.0","method":"listaccounts","params":[],"id":1}
    };
    const response = await axios(options);
    if (response.status === 200) {
      if(response.data && response.data.Result)
      return response.data.Result;
    }
    return false;
  }

  openAccountDetail = (account) => {
    this.modalAccountDetailRef.open();
    this.setState({modalAccountDetail: ''});
  }

  render() {
    const { classes } = this.props;
    const { walletName, accountList, modalAccountDetail } = this.state;

    return (
      <div>
        { accountList.length > 0 ?
          <Paper className={classes.root} elevation={1} style={{padding: "0px 10px"}}>
            <div className="walletName">{walletName}</div>
            <List component="nav">
              {
                accountList.map(a => {
                  return (
                <ListItem button key={Math.random()} onClick={()=> this.openAccountDetail(a)}>
                  <ListItemIcon>
                    {a.default ? <StarIcon className="text-primary" /> : <span className="emptyIcon" />}
                  </ListItemIcon>
                  <ListItemText inset primary={a.name} />
                  <ListItemSecondaryAction className="badge badge-secondary badge-pill">
                    {a.value}
                  </ListItemSecondaryAction>
                </ListItem>)
                })
              }

              
            </List>
          </Paper> : 
          <div className="text-center">
            <img src={img1} />
            <h3 className="text-secondary mt-3">Not found your account(s)</h3>
          </div> 
        }
        <Dialog title="ANNOUNCEMENT" onRef={modal => this.modalAccountDetailRef = modal}>
          {modalAccountDetail}
        </Dialog>
      </div>
    );
  }
}

AccountList.propTypes = {
  classes: PropTypes.object.isRequired,

};

export default withStyles(styles)(AccountList);

