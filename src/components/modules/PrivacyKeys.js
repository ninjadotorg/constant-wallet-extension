import React from 'react';
import PropTypes from 'prop-types';
import {
    
    Tabs,
    Tab,
    Divider,
    List,
    ListItemText,
    ListItemSecondaryAction,
    ListItem,
    Avatar,
    Button,
    Snackbar,
  } from '@material-ui/core';

import {
Security as IconSecurity,
VpnKey as IconSealer,
Error as IconError,
CheckCircle as IconSuccess,
Warning as IconWarning,
Remove as IconRemove
} from '@material-ui/icons';

import {CopyToClipboard} from 'react-copy-to-clipboard';
import Account from '../../services/Account';
import './PrivacyKeys.scss'

class PrivacyKeys extends React.Component {
    static propTypes = {
        paymentAddress: PropTypes.string.isRequired,
        readonlyKey: PropTypes.string.isRequired,
    }
    constructor(props) {
        super(props);
        this.state = {
            privateKey: '',

        }
    }

    async componentDidMount() {

    }
    async componentWillReceiveProps(nextProps) {
        await this.getPrivateKey();
    }

    getPrivateKey = async () => {
        let { paymentAddress} = this.props;
        console.log('Payment Address:', paymentAddress);
    
        const result = await Account.getPrivateKey(paymentAddress);
        if (result && result.PrivateKey) {
          this.setState({privateKey: result.PrivateKey});
        }
      }


      get showDumpKey() {
        const {privateKey, readonlyKey, isExportDumpKey} = this.state;

        const classes = this.props.classes;
    
        if (!isExportDumpKey) {
          return "";
        }
        else {
          return (
            <div className="list-group sealerKey">
              <CopyToClipboard text={readonlyKey} onCopy={() => this.copyToClipBoard()}>
                <a href="#"
                   className={"list-group-item list-group-item-action flex-column align-items-start " + classes.key}>
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">Readonly Key</h5>
                    <small className="text-muted">click to Copy</small>
                  </div>
                  <div className="mb-1 word-wrap-break">{readonlyKey}</div>
                </a>
              </CopyToClipboard>
              <CopyToClipboard text={privateKey} onCopy={() => this.copyToClipBoard()}>
                <a href="#"
                   className={"list-group-item list-group-item-action flex-column align-items-start " + classes.key}>
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

    confirmRemoveAccount = () => {
    this.modalDeleteAccountRef.open();
    }
    removeAccount = async () => {
    let {privateKey, paymentAddress, account} = this.state;

    if (!privateKey) {
        const result = await Account.getPrivateKey(paymentAddress);
        if (result && result.PrivateKey) {
        privateKey = result.PrivateKey;
        }
    }

    if (privateKey) {
        const result = await Account.removeAccount([privateKey, account.name, '12345678']);
        if (result) {
        this.onFinish({message: 'Account is removed!'});
        }
        else if (result.error) {
        this.showError(result.message);
        }
        else {
        this.showError('Remove error!');
        }
    }
    else {
        this.showError('Not found Private Key!');
    }
    }

    renderReadonlyKey = () => {
        const { readonlyKey } = this.props;
        return (
            <div className="wrapperKeys">
                <div className="keyNameReadonly">Readonly Keys</div>
                <div className="keyDes">{readonlyKey}</div>
            </div>
        );
    }

    renderPrivacyKey = () => {
        const { privateKey } = this.state;
        return (
            <div className="wrapperKeys">
                <div className="keyNamePrivacy">Privacy Keys</div>
                <div className="keyDes">{privateKey}</div>
            </div>
        );
    }
    renderRemoveAccount = () => {
        return (
            <div />
        );
    }

    render () {
        const { isExportDumpKey } = this.state;
        return (
            <div className="wrapperPrivacyKeyContainer">
                {this.renderReadonlyKey()}
                {this.renderPrivacyKey()}
                {this.renderRemoveAccount()}

          <ListItem>
            <Avatar>
              <IconRemove/>
            </Avatar>
            <ListItemText disableTypography
                          primary={<span className="btn text-danger cursor-pointer pl-0">Remove account</span>}
                          onClick={() => this.confirmRemoveAccount()}/>
          </ListItem>
          </div>
        );
    }
}
export default PrivacyKeys;
