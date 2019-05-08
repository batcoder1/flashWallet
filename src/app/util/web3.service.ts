import { Injectable } from '@angular/core';
import contract from 'truffle-contract';
import { Subject } from 'rxjs';
import { resolve } from 'url';
import { reject } from 'q';
declare let require: any;
const Web3 = require('web3');


declare let window: any;

@Injectable()
export class Web3Service {
  private web3: any;
  private accounts: string[];
  public ready = false;

  public accountsObservable = new Subject<string[]>();

  constructor() {


    window.addEventListener('load', async () => {

      await this.bootstrapWeb3();

    });
  }

  async bootstrapWeb3() {
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      try {
        console.log('Ethereum browser detected.  !');
        // Request account access if needed
        await window.ethereum.enable();
        this.web3 = window.web3
        this.web3.eth.defaultAccount = this.web3.eth.accounts[0]
        // Acccounts now exposed
        await this.refreshAccounts()

      } catch (error) {
        // User denied account access...
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      console.log('legagy dapp browser');
      window.web3 = new Web3(this.web3.currentProvider);
      this.web3 = window.web3
      // Acccounts always exposed
      await this.refreshAccounts()
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }

  }

  public async artifactsToContract(artifacts) {
    console.log('artifactsToContract....')
    try {
      let calileaTokenAddress = '0x23803d6ca1b654ca0a0ec607445ce1f50c0a7a3c'
      if (!this.web3) {
        const delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;
        return await this.artifactsToContract(artifacts);
      }
      const contractAbstraction = contract(artifacts);
      contractAbstraction.setProvider(this.web3.currentProvider);
      let tokenContractAbstraction = await contractAbstraction.at(calileaTokenAddress)
      console.log(tokenContractAbstraction)
      return tokenContractAbstraction;
    } catch (err) {

      return false
    }

  }

  async refreshAccounts() {
    try {
      let accs = await this.web3.eth.getAccounts()
      if (accs.length === 0) {
        console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return false;
      }
      if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
        
        this.accountsObservable.next(accs);
        this.accounts = accs;
      }


      this.ready = true;
    }catch(err){
      console.log('There was an error fetching your accounts.');
    }
    
  }

  async getBalance(address) {
    console.log('getBalance...' + address)

    const balanceWei = await this.web3.eth.getBalance(address)
    const balance = this.web3.utils.fromWei(balanceWei, 'ether')
    console.log('balance:' + balance)
    return balance


  }

  async estimateGas(data, sender){
    let toEstimate = {
      data: data,
      from: sender
    }
    let gasEstimated = await this.web3.eth.estimateGas(toEstimate)
    console.log('GasEstimated:'+ gasEstimated)
    return gasEstimated
  }

  formatAmount(amount){
    return this.web3.utils.toWei(amount, "ether")
  }
    
}
