import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Web3 from "web3";

import Adoption from "./contracts/Adoption.json";

var web3 = new Web3(Web3.givenProvider || "ws://localhost:7545");

class App extends Component {
  state = {};

  componentDidMount() {
    web3.eth.getAccounts((e, accounts) => {
      const account = accounts[0];
      this.setState({ account }, this._deployContract);
    });
  }

  _deployContract = () => {
    console.log("deploy contract...");
    const { account } = this.state;
    web3.eth.defaultAccount = account;

    let gasPrice;
    let gas;
    let contractInstance;

    const networkId = Object.keys(Adoption.networks)[0];
    const deployedAddress = Adoption.networks[networkId].address;
    let contract = new web3.eth.Contract(Adoption.abi, deployedAddress);

    // web3.eth
    //   .getGasPrice()
    //   .then(averageGasPrice => {
    //     console.log("Average gas price: " + averageGasPrice);
    //     gasPrice = averageGasPrice;
    //   })
    //   .catch(console.error);

    // contract
    //   .deploy({ data: Adoption.bytecode })
    //   .estimateGas()
    //   .then(estimatedGas => {
    //     console.log("Estimated gas: " + estimatedGas);
    //     gas = estimatedGas;
    //   })
    //   .catch(console.error);

    contract
      .deploy({ data: Adoption.bytecode })
      .send({
        from: account,
        gas: 4712388,
        gasPrice: 100000000000
      })
      .then(instance => {
        console.log("Contract mined at " + instance.options.address);
        contractInstance = instance;
        contractInstance.events
          .Adopted()
          .on("data", event => console.log("EVENT", event))
          .on("error", event => console.log("ERROR", event));
        console.log(contractInstance);
        this.setState({ contractInstance });
      })
      .catch(error => console.log(error));
  };

  _adopt = () => {
    const { account, contractInstance } = this.state;
    contractInstance.methods
      .adopt(1)
      .call({ from: account }, (error, result) => {
        console.log(error)
        console.log("RESULT", result);
      });
  };

  _getAdopters = () => {
    const { account, contractInstance } = this.state;
    contractInstance.methods
      .getAdopters()
      .call({ from: account }, (error, result) => console.log(result));
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div>
          <button onClick={this._adopt}>adopt</button>
        </div>
        <div>
          <button onClick={this._getAdopters}>log adopters</button>
        </div>
      </div>
    );
  }
}

export default App;
