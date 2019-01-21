import React from 'react';
import PropTypes from 'prop-types';
import {
    
    Tabs,
    Tab,
  } from '@material-ui/core';

  import {
    Security as IconSecurity,
    VpnKey as IconSealer,
    Error as IconError,
    CheckCircle as IconSuccess,
    Warning as IconWarning,
    Remove as IconRemove
  } from '@material-ui/icons';
  import PrivacyKeys from './PrivacyKeys';
  import TokenTabs from './TokenTabs';


  const styles = theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  
  });
  class MainTabs extends React.Component {
    static propTypes = {
      paymentAddress: PropTypes.string.isRequired,
      readonlyKey: PropTypes.string.isRequired
    }

    constructor(props) {
        super(props);
        this.state = {
            value: 0,
            isExportDumpKey: false,
            privateKey: '',
            readonlyKey: '',

        }
    }

    handleChange = (event, value) => {
        this.setState({ value });
    };
    renderPrivacyKey = (value) => {
        if (value !== 0) return null;
        console.log('Main Tabs Props:', this.props);
        return (
            <PrivacyKeys {...this.props}/>
        );
    }
    renderHistory = (value) => {
        if (value !== 1) return null;
        return (
            <div>ITEM HISTORY</div>
        );
    }

    renderTokenTabs = (value) => {
      if (value !== 2) return null;

      const { paymentAddress } = this.props;
      const { privateKey } = this.state;
      const props = {
        paymentAddress: paymentAddress,
        privateKey: privateKey,
        ...this.props,
      }
      return (
        <TokenTabs ref={(component) => { this.tokenTabsRef = component; }} {...props}/>
      );
    }
 
    renderTabs() {
        const {value} = this.state;
        return(
            <div className={styles.root} style={{"width": "100%"}}>
                <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    fullWidth
                    onChange={this.handleChange}
                    className="tokenTabs"
                    >
                    <Tab label="PRIVACY KEY" />
                    <Tab label="HISTORY" />
                    <Tab label="TOKENS" />  
                </Tabs>
                {this.renderPrivacyKey(value)}
                {this.renderHistory(value)}
                {this.renderTokenTabs(value)}
            </div>
        );
    }

    render() {
        return (
            <div className = "wrapperTabs">
            {this.renderTabs()}
            </div>
        );
    }
  }
  export default MainTabs;


