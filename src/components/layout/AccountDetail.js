import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Divider, List, ListItemText, ListItemSecondaryAction, ListItem , Avatar, Button, Snackbar, TextField} from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import Account from '../../services/Account';

import { 
  Security as IconSecurity, 
  VpnKey as IconSealer, 
  Info as IconInfo,
  Warning as IconWarning,
  Work as IconWork
} from '@material-ui/icons';

const styles = theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  key: {
    backgroundColor: '#fff2df',
    border: 'none',
    marginBottom: '1px'
  },
  textField: {
    width: "90%",
    textAlign: 'center',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
});

class AccountDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: props.account,
      sealerKey: '',
      publicKey: '',
      privateKey: '',
      readonlyKey: '',
      showAlert: '',
      balance: 0,
      isAlert: false,
      isExportDumpKey: false
    }
  }

  async componentDidMount(){
    const key = await Account.getPublicKey(this.state.account.name);
    if(key){
      this.setState({privateKey: key.PrivateKey, publicKey: key.PublicKey, readonlyKey: key.ReadonlyKey})
    }

    const balance = await Account.getBalance(`[${this.state.account.name}, 1, 12345678]`);
    if(balance){
      this.setState({balance: balance.Result});
    }
  }

  onFinish = (data) => {
    const { onFinish } = this.props;
    
    if (onFinish) {
      onFinish(data);
    }
  }

  doExportSealer = async () => {
    let { privateKey, sealerKey, publicKey } = this.state;
    if(sealerKey){
      this.setState({sealerKey: false});
    } 
    else{
      if(!privateKey){
        const result = await Account.getPrivateKey(publicKey);
        if(result && result.PrivateKey){
          privateKey = result.PrivateKey;
          this.setState({privateKey: result.PrivateKey});
        }
      }
        
      if(privateKey){
        sealerKey = await Account.getSealerKey(privateKey);
        if(sealerKey){
          this.setState({sealerKey});
        }
      }
    }
  }

  doExportKey = async () => {
    let { privateKey, publicKey, isExportDumpKey } = this.state;
    this.setState({isExportDumpKey: !isExportDumpKey});

    if(!privateKey){
      const result = await Account.getPrivateKey(publicKey);
      if(result && result.PrivateKey){
        this.setState({privateKey: result.PrivateKey});
      }
    }
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    this.setState({ showAlert: '', isAlert: false });
  };

  copyToClipBoard = () => {
    this.showAlert('Copied!', 'info');
  }

  showAlert = (msg, flag='warning') => {
    let showAlert = '', isAlert = true, icon = <IconWarning />;

    if(flag === 'info')
      icon = <IconInfo />;

    this.setState({isAlert}, ()=> {
      showAlert = <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isAlert}
        autoHideDuration={1000}
        onClose={this.handleClose}
      >
        <div className={"alert alert-"+flag} role="alert">{icon} {msg}</div>
      </Snackbar>

      this.setState({showAlert});
    });
  }

  get showDumpKey(){
    const { privateKey, readonlyKey, isExportDumpKey } = this.state;
    const classes = this.props.classes;

    if(!isExportDumpKey){
      return "";
    }
    else{
      return (
        <div className="list-group sealerKey">
          <CopyToClipboard text={readonlyKey} onCopy={() => this.copyToClipBoard()}>
          <a href="#" className={"list-group-item list-group-item-action flex-column align-items-start " + classes.key}>
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Readonly Key</h5>
                <small className="text-muted">click to Copy</small>
              </div>
              <div className="mb-1 word-wrap-break">{readonlyKey}</div>
            </a>
          </CopyToClipboard>
          <CopyToClipboard text={privateKey} onCopy={() => this.copyToClipBoard()}>
          <a href="#" className={"list-group-item list-group-item-action flex-column align-items-start " + classes.key}>
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Private Key</h5>
                <small className="text-muted">click to Copy</small>
              </div>
              <div className="mb-1 word-wrap-break">{privateKey}</div>
            </a>
          </CopyToClipboard>        
        </div>
      );
    }
  }

  get showSealerKey(){
    const sealerKey = this.state.sealerKey;
    const classes = this.props.classes;

    if(!sealerKey){
      return "";
    }
    else{
      return (
        <div className="list-group sealerKey">
          <CopyToClipboard text={sealerKey.SealerKeySet} onCopy={() => this.copyToClipBoard()}>
            <a href="#" className={"list-group-item list-group-item-action flex-column align-items-start " + classes.key}>
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Sealer Key Set</h5>
                <small className="text-muted">click to Copy</small>
              </div>
              <div className="mb-1 word-wrap-break">{sealerKey.SealerKeySet}</div>
            </a>
          </CopyToClipboard>
          <CopyToClipboard text={sealerKey.SealerPublicKey} onCopy={() => this.copyToClipBoard()}>
          <a href="#" className={"list-group-item list-group-item-action flex-column align-items-start " + classes.key}>
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Sealer Public Key</h5>
                <small className="text-muted">click to Copy</small>
              </div>
              <div className="mb-1 word-wrap-break">{sealerKey.SealerPublicKey}</div>
            </a>
          </CopyToClipboard>        
        </div>
      );
    }
  }

  render() {
    const { classes } = this.props;
    const { account, sealerKey, isExportDumpKey, showAlert, publicKey, balance } = this.state
    
    return (
      <div className={classes.root}>
        {showAlert}
        <List>
          <ListItem style={{textAlign: 'center', display: 'inline-block'}}>
            <div>
              <h1>{account.name}</h1>
              <div className="p-3">{publicKey && <QRCode value={publicKey} size={256} renderAs="svg" />}</div>
              <div>
                <CopyToClipboard text={publicKey} onCopy={() => this.copyToClipBoard()}>
                  <TextField
                    id="publicKey"
                    className={classes.textField}
                    value={publicKey}
                    margin="normal"
                    variant="outlined"
                    disabled />
                </CopyToClipboard>
              </div>
            </div>
          </ListItem>
          <Divider />

          <ListItem>
            <Avatar>
              <IconWork />
            </Avatar>
            <ListItemText primary="Balance" secondary={balance} />
          </ListItem>
          <Divider />

          <ListItem>
            <Avatar>
              <IconSealer />
            </Avatar>
            <ListItemText disableTypography primary={isExportDumpKey ? "" : "Dump Private Keys"} secondary={this.showDumpKey} />
            <ListItemSecondaryAction>
              <Button variant="contained" size="small" color="default"
                  onClick={() => this.doExportKey()} >
                  {isExportDumpKey ? "Hide" : "Export"}
                </Button>
            </ListItemSecondaryAction>
          </ListItem> 
          <Divider />

          <ListItem>
            <Avatar>
              <IconSecurity />
            </Avatar>
            <ListItemText disableTypography primary={sealerKey ? "" : "Sealer Keyset"} secondary={this.showSealerKey} />
            <ListItemSecondaryAction>
              <Button variant="contained" size="small" color="default"
                onClick={() => this.doExportSealer()} >
                {sealerKey ? "Hide" : "Export"}
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
