import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@material-ui/core';

class TokenItem extends React.Component {
    static propTypes = {
        item: PropTypes.object.isRequired,
        onClickToken: PropTypes.func
    }
    static defaultProps = {
    }
    handleClickButton = () => {
        const { onClickToken, item } = this.props;
        onClickToken(item);
    }
    render() {
        const { item } = this.props;
        const { Amount, Name, Symbol, TokenID } = item;
        return (
            <div className="wrapperTokenItem">
                <div className="wrapperTokenInfo">
                    <div className="tokenId">{TokenID}</div>
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