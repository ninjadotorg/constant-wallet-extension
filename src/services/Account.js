import axios from 'axios';

export default class Account {

  static getOption(method, params){
    const url = "http://127.0.0.1:9334",
      username = '', 
      password = '';

    const auth = "Basic " + new Buffer(username+':'+password).toString('base64');
    const options = {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': auth
      },
      url,
      data: {
        "jsonrpc":"1.0",
        "method": method, 
        "params": params,
        "id":1
      }
    };

    return options;
  }


  static async getPublicKey(param) {
  
    const response = await axios(Account.getOption("getaccountaddress", param));
    if (response.status === 200) {
      if(response.data && response.data.Result)
      return response.data.Result;
    }
    return false;
  }

  static async getBalance(param) {
  
    const response = await axios(Account.getOption("getbalance", param));
    if (response.status === 200) {
      if(response.data && response.data.Result)
      return response.data.Result;
    }
    return false;
  }


  static async createAccount(param) {

    const response = await axios(Account.getOption("getaccountaddress", param));
    if (response.status === 200) {console.log(response);
      if(response.data && response.data.Result)
        return response.data.Result;
    }
    return false;
  }

  static async getAccountList(param) {

    const response = await axios(Account.getOption("listaccounts", param));
    if (response.status === 200) {
      if(response.data && response.data.Result)
      return response.data.Result;
    }
    return false;
  }

  static async getSealerKey(param) {
  
    const response = await axios(Account.getOption("createsealerkeyset", param));
    if (response.status === 200) {
      if(response.data && response.data.Result)
        return response.data.Result;
    }
    return false;
  }

  static async getPrivateKey(param) {
    const response = await axios(Account.getOption("dumpprivkey", param));
    if (response.status === 200) {
      if(response.data && response.data.Result)
        return response.data.Result;
    }
    return false;
  }
}