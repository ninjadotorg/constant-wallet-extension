import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Divider, List, ListItemText, ListItemSecondaryAction, ListItem , Avatar, Button, Snackbar} from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import QRCode from 'qrcode.react';
import ConfirmDialog from '../../core/ConfirmDialog'
import Account from '../../../services/Account';

import { 
  Security as IconSecurity, 
  VpnKey as IconSealer, 
  Error as IconError,
  CheckCircle as IconSuccess,
  Warning as IconWarning,
  Remove as IconRemove
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
  },
});

class AccountDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: props.account,
      sealerKey: '',
      paymentAddress: '',
      privateKey: '',
      readonlyKey: '',
      showAlert: '',
      balance: 0,
      isAlert: false,
      isExportDumpKey: false
    }
  }

  async componentDidMount(){
    const key = await Account.getPaymentAddress(this.state.account.name);
    if(key){
      this.setState({privateKey: key.PrivateKey, paymentAddress: key.PaymentAddress, readonlyKey: key.ReadonlyKey})
    }

    const result = await Account.getBalance([this.state.account.name, 1, "12345678"]);
    if (result.error) {
      this.showError(result.message);
    }
    else{
      //format mili constant to constant
      this.setState({balance: Number(result) / 1000});
    }
  }

  onFinish = (data) => {
    const { onFinish } = this.props;
    
    if (onFinish) {
      onFinish(data);
    }
  }

  doExportSealer = async () => {
    let { privateKey, sealerKey, paymentAddress } = this.state;
    if(sealerKey){
      this.setState({sealerKey: false});
    } 
    else{
      if(!privateKey){
        const result = await Account.getPrivateKey(paymentAddress);
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
    let { privateKey, paymentAddress, isExportDumpKey } = this.state;
    this.setState({isExportDumpKey: !isExportDumpKey});

    if(!privateKey){
      const result = await Account.getPrivateKey(paymentAddress);
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

  confirmRemoveAccount = () => {
    this.modalDeleteAccountRef.open();
  }
  removeAccount = async () => {
    let { privateKey, paymentAddress, account } = this.state;

    if(!privateKey){
      const result = await Account.getPrivateKey(paymentAddress);
      if(result && result.PrivateKey){
        privateKey = result.PrivateKey;
      }
    }
    
    if(privateKey){
      const result = await Account.removeAccount([privateKey, account.name, '12345678']);
      if(result){
        this.onFinish({message:'Account is removed!'});
      }
      else if(result.error){
        this.showError(result.message);
      }
      else{
        this.showError('Remove error!');
      }
    }
    else{
      this.showError('Not found Private Key!');
    } 
  }

  showAlert = (msg, flag='warning') => {
    let showAlert = '', isAlert = true, icon = <IconWarning />;

    if(flag === 'success')
      icon = <IconSuccess />;
    else if(flag === 'danger')
      icon = <IconError />;
    else
      icon = '';

    this.setState({isAlert}, ()=> {
      showAlert = <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={isAlert}
        autoHideDuration={2000}
        onClose={this.handleClose}
      >
        <div className={"alert alert-"+flag} role="alert">{icon} {msg}</div>
      </Snackbar>

      this.setState({showAlert});
    });
  }

  showSuccess = (msg) => {
    this.showAlert(msg, 'success');
  }

  showError = (msg) => {
    this.showAlert(msg, 'danger');
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
          <CopyToClipboard text={sealerKey.ProducerKeySet} onCopy={() => this.copyToClipBoard()}>
            <a href="#" className={"list-group-item list-group-item-action flex-column align-items-start " + classes.key}>
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Sealer Key Set</h5>
                <small className="text-muted">click to Copy</small>
              </div>
              <div className="mb-1 word-wrap-break">{sealerKey.ProducerKeySet}</div>
            </a>
          </CopyToClipboard>
          <CopyToClipboard text={sealerKey.ProducerPublicKey} onCopy={() => this.copyToClipBoard()}>
          <a href="#" className={"list-group-item list-group-item-action flex-column align-items-start " + classes.key}>
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">Sealer Public Key</h5>
                <small className="text-muted">click to Copy</small>
              </div>
              <div className="mb-1 word-wrap-break">{sealerKey.ProducerPublicKey}</div>
            </a>
          </CopyToClipboard>        
        </div>
      );
    }
  }

  render() {
    const { classes } = this.props;
    const { account, sealerKey, isExportDumpKey, showAlert, paymentAddress, balance } = this.state
    
    return (
      <div className={classes.root}>
        {showAlert}
        <List>
          <ListItem style={{textAlign: 'center', display: 'inline-block'}}>
            <div>
              <h1>{account.name}</h1>
              <div className="p-2">{paymentAddress && <QRCode value={paymentAddress} size={164} renderAs="svg" fgColor="gray" />}</div>
              <div>
                <CopyToClipboard text={paymentAddress} onCopy={() => this.copyToClipBoard()}>
                  <input className="form-control mt-2" id="paymentAddress" defaultValue={paymentAddress} />
                </CopyToClipboard>
              </div>
              <h5 className="pt-3">{ balance ? Math.round(balance).toLocaleString() : 0} CONSTANT</h5>
            </div>
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

          {/* <ListItem>
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
          <Divider /> */}

          <ListItem>
            <Avatar>
              <IconRemove />
            </Avatar>
            <ListItemText disableTypography primary={<span className="btn text-danger cursor-pointer pl-0">Remove account</span>} onClick={() => this.confirmRemoveAccount()} />
          </ListItem>
        </List>
        <ConfirmDialog title="Delete Account" onRef={modal => this.modalDeleteAccountRef = modal} onOK={()=> this.removeAccount()} className={{margin: 0}}>
          <div>Are you sure to delete?</div>
        </ConfirmDialog>
      </div>
    );
  }
}

AccountDetail.propTypes = {
  classes: PropTypes.object.isRequired,

};

export default withStyles(styles)(AccountDetail);
