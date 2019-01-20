import React from 'react';
import PropTypes from 'prop-types';

import AccountDetail from '../layout/Account/Detail';

class Home extends React.Component {
  static propTypes = {
    account: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
    }
    
  }
  componentWillReceiveProps(nextProps) {
    console.log("Home Next Props:", nextProps.account);
  }

  render() {
    const { account } = this.props;
    console.log('Home Account:', account);
    return (
      <div className="">
        {/* <h1>Home</h1> */}
        {/*<AccountList />*/}
        {<AccountDetail account={account} onFinish={() => this.reload()} />}
      </div>
    );
  }
}

Home.propTypes = {
};

export default Home;
