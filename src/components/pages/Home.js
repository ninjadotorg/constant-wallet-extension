import React from 'react';
import AccountList from '../layout/Account/List'

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    
  }

  render() {

    return (
      <div className="">
        {/* <h1>Home</h1> */}
        <AccountList />
      </div>
    );
  }
}

Home.propTypes = {
};

export default Home;
