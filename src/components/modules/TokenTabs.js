import React from 'react';
import PropTypes from 'prop-types';
import {
    
    Tabs,
    Tab
  } from '@material-ui/core';

import Token from '../../services/Token';
import TokenList from './TokenList';
import { Button } from '@material-ui/core';

import './TokenTabs.scss';

const styles = theme => ({
    root: {
      flexGrow: 1,
      backgroundColor: theme.palette.background.paper,
    },
  });
class TokenTabs extends React.Component {
    static propTypes = {
        paymentAddress: PropTypes.string.isRequired,
        privateKey: PropTypes.string.isRequired
    }
    constructor(props) {
        super(props);
        this.state = {
            showAlert: '',
            value: 0,
            listCustomTokenBalance: [],
            listPrivacyTokenBalance: [],
        }
    }
    componentWillReceiveProps(nextProps) {
        const { value } = this.state;
        this.getTokens(value);
    }
    onRefresh = () => {
        const { value } = this.state;
        setTimeout(() => {
            this.getTokens(value);

        }, 2000);
    }
    handleChange = (event, value) => {
        this.setState({ value });
        this.getTokens(value);
    };


    getCustomTokenBalance = async () => {
        const { paymentAddress } = this.props;
        const params = [];
        params.push(paymentAddress);
        const results = await Token.getListCustomTokenBalance(params);
        console.log('Result:', results);
        const { ListCustomTokenBalance } = results;
        if (ListCustomTokenBalance) {
            this.setState({
                listCustomTokenBalance: ListCustomTokenBalance
            });
        }
    }
    getPrivacyTokenBalance = async () => {
        const { privateKey } = this.props;
        const params = [];
        params.push(privateKey);
        const results = await Token.getListPrivacyCustomTokenBalance(params);
        console.log('Result:', results);
        const { ListCustomTokenBalance } = results;
        if (ListCustomTokenBalance) {
            this.setState({
                listPrivacyTokenBalance: ListCustomTokenBalance
            });
        }
    }
    getTokens = async (tab) => {
       if(tab === 0) {
        await this.getCustomTokenBalance()
       } else {
        await this.getPrivacyTokenBalance();
       }   
    }
    handleCreateToken = () => {
        const { value } = this.state;
        this.props.onCreateToken(value);
        
    }

  
    renderNewTokenButton() {
        return (
            <Button 
                variant="contained" 
                size="medium" 
                color="primary" 
                className="newTokenButton"
                onClick={this.handleCreateToken} >
                Create New Token
                </Button>
        );
    }
    renderTabs() {
        const { value, listCustomTokenBalance, listPrivacyTokenBalance } = this.state;
        const props = {
            list: value === 0 ? listCustomTokenBalance : listPrivacyTokenBalance,
            tab: value,
            ...this.props
        }
        return(
            <div className={styles.root}>
                <Tabs
                    value={value}
                    indicatorColor="primary"
                    textColor="primary"
                    fullWidth
                    onChange={this.handleChange}
                    >
                    <Tab label="Custom" />
                    <Tab label="Privacy" />
                </Tabs>
                <TokenList {...props}/>
            </div>
        );
    }
    render(){
        return(
            <div className = "wrapperTabs">
            {this.renderTabs()}
            {this.renderNewTokenButton()}
            </div>
        );
    };
}
export default TokenTabs;