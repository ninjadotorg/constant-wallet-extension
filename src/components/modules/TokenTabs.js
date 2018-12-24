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

const publicKey = "1Uv3jP4ixNx3BkEtmUUxKXA1TXUduix3KMCWXHvLqVyA9CFfoLRZ949zTBNqDUPSzaPCZPrQKSfiEHguFazK6VeDmEk1RMLfX1kQiSqJ6";
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
            value: 0,
            listCustomTokenBalance: [],
            listPrivacyTokenBalance: [],
        }
    }
    componentWillReceiveProps(nextProps) {
        const { value } = this.state;
        this.getTokens(value);
    }
    componentDidMount() {
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
        const { ListCustomTokenBalance, PaymentAddress } = results;
        if (ListCustomTokenBalance) {
            console.log('Token List:', ListCustomTokenBalance);
            this.setState({
                listCustomTokenBalance: ListCustomTokenBalance
            });
        }
    }
    getPrivacyTokenBalance = async () => {
        const { privateKey } = this.props;
        const params = [];
        params.push(privateKey);
        console.log('Params:', params);
        const results = await Token.getListPrivacyCustomTokenBalance(params);
        console.log('Result:', results);
        const { ListCustomTokenBalance, PaymentAddress } = results;
        if (ListCustomTokenBalance) {
            console.log('Token List:', ListCustomTokenBalance);
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
    handleClickToken = (token) => {

    }
    renderNewTokenButton() {
        return (
            <Button 
                variant="contained" 
                size="medium" 
                color="primary" 
                className="newTokenButton"
                onClick={this.handleClickButton} >
                Create New Token
                </Button>
        );
    }
    renderTabs() {
        const { value, listCustomTokenBalance, listPrivacyTokenBalance } = this.state;
        const props = {
            list: value === 0 ? listCustomTokenBalance : listPrivacyTokenBalance,
            onClickToken: this.handleClickToken
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