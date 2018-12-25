import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';

class TokenItem extends React.Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        onSendToken: PropTypes.func
    }
    static defaultProps = {
    }
    handleClickButton = () => {
        const { onSendToken, item, tab } = this.props;
        onSendToken(item, tab);
    }
    render() {
        const { item } = this.props;
        const { Amount, Name, Symbol, TokenID, src } = item;
        return (
            <div className="wrapperTokenItem">
                <div className="wrapperTokenInfo">
                    <div className="tokenId">{TokenID}</div>
                    {/*<Avatar alt="avatar" src={src} />*/}
                    <div className="tokenName">{Name}</div>
                    <div className="tokenAmount">{Amount}</div>
                </div>
                <Button 
                variant="contained" 
                size="medium" 
                color="primary" 
                className="tokenButton"
                onClick={this.handleClickButton} >
                Send
                </Button>
            </div>
        );
    }
}

class TokenList extends React.Component {
    static propTypes = {
        list: PropTypes.array.isRequired
    }
    render() {
        const { list } = this.props; 
        return (
            <div className="wrapperTokenList">
            {list.map((item, index) => (
                <TokenItem key={index} item={item} {...this.props} />
            ))}
            </div>
        );
    }
}
export default TokenList;