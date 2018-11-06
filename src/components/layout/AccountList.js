import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Button, Paper, Tooltip } from '@material-ui/core';
import AccountDetail from '../layout/AccountDetail'
import AccountSend from '../layout/AccountSend'

import StarIcon from '@material-ui/icons/Star';
import SendIcon from '@material-ui/icons/Send';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import Dialog from '../core/Dialog'
import img1 from '../../assets/images/img1.png'
import Account from '../../services/Account';

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
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
});

class AccountList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      walletName: '',
      accountList: [],
      modalAccountDetail: '',
      modalAccountSend: ''
    }
    
  }

  async componentDidMount(){
    const result = await Account.getAccountList([]);
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



  openAccountDetail = (account) => {
    this.modalAccountDetailRef.open();
    this.setState({modalAccountDetail: <AccountDetail account={account} />});
  }

  openAccountSend = (account) => {
    this.modalAccountDetailRef.close();
    this.setState({modalAccountDetail: '',
      modalAccountSend: <AccountSend account={account} />
    });
    this.modalAccountSendRef.open();
  }

  openAccountCandidate = (account) => {
    this.modalAccountDetailRef.close();
    this.setState({modalAccountDetail: '',
      modalAccountCandidate: ''
    });
    this.modalAccountCandidateRef.open();
  }

  get detailButtonAction(){
    const { classes } = this.props;
    
    return (<div>
      <Tooltip title="Register Candidate">
        <Button mini variant="fab" color="secondary" className={classes.button} aria-label="Register Candidate"  onClick={() => this.openAccountCandidate()}>      
          <AssignmentIndIcon />
        </Button>
      </Tooltip>
      <Tooltip title="Send Coin">
        <Button mini variant="fab" color="secondary" className={classes.button} aria-label="Send Coin"  onClick={() => this.openAccountSend()}>
          <SendIcon />
        </Button>
      </Tooltip>
    </div>
    );
  }

  render() {
    const { classes } = this.props;
    const { walletName, accountList, modalAccountDetail, modalAccountSend } = this.state;

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
            <img src={img1} alt="" />
            <h3 className="text-secondary mt-3">Not found your account(s)</h3>
          </div> 
        }
        <Dialog title="Account Detail" onRef={modal => this.modalAccountDetailRef = modal} className={{margin: 0}} buttonAction={this.detailButtonAction}>
          {modalAccountDetail}
        </Dialog>

         <Dialog title="Send Coin" onRef={modal => this.modalAccountSendRef = modal} className={{margin: 0}}>
          {modalAccountSend}
        </Dialog>
        <Dialog title="Register Candidate" onRef={modal => this.modalAccountCandidateRef = modal} className={{margin: 0}}>
          <h1>Under construction</h1>
        </Dialog>
      </div>
    );
  }
}

AccountList.propTypes = {
  classes: PropTypes.object.isRequired,

};

export default withStyles(styles)(AccountList);

