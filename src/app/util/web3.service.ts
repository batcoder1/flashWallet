import { Injectable } from '@angular/core';
import contract from 'truffle-contract';
import { Subject } from 'rxjs';
import { resolve } from 'url';
import { reject } from 'q';
declare let require: any;
const Web3 = require('web3');

const CalileaToken_json = require('../../../build/contracts/CalileaToken.json');
const TokenSale_json = require('.././../../build/contracts/TokenSale.json');
declare let window: any;

@Injectable()
export class Web3Service {
  private web3: any;
  private accounts: string[];
  public ready = false;
  private contracts= {
    calileaToken: contract,
    tokenSale: contract

  };
/* Contracts in Ropsten network  
   private calileaTokenContract = '0x80ea7a8870266eef66cb3d03880851fa4c378d14'
  private tokenSaleContract = '0xC669d352Eb9DB6d02242F1d32B8AA173BF09cACc' 
  */
// Contracts in Ganache local network
  private calileaTokenContract = '0xbC41FD4d113E8Dd9F823Ef11Ed56DE7661eB9dc6'
  private tokenSaleContract = '0xde63CE70f7872Dd18D2A1B1E46F9eDDeFc074A86'
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
        const account = await this.web3.eth.getCoinbase() 
        console.log(`**** Account: ${account}`)
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

  public async getInstanceCalileaToken() {
    console.log('getInstanceCalileaToken....')
    try {
      
      if (!this.web3) {
        const delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;
        return await this.getInstanceCalileaToken();
      }
      console.log ('web3 connected')
      let contractAbstraction = contract(CalileaToken_json);
      contractAbstraction.setProvider(this.web3.currentProvider);
      contractAbstraction = await contractAbstraction.at(this.calileaTokenContract)
        
      return contractAbstraction
    } catch (err) {
      console.log(err)
      return false
    }

  }
  public async getInstanceTokenSale() {
    console.log('getInstanceTokenSale....')
    try {
      
      if (!this.web3) {
        const delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;
        return await this.getInstanceTokenSale();
      }
      console.log ('web3 connected')
      
      let contractAbstraction = contract(TokenSale_json);  
      contractAbstraction.setProvider(this.web3.currentProvider);
      contractAbstraction = await contractAbstraction.at(this.tokenSaleContract)
      
      return contractAbstraction

    } catch (err) {
      console.log(err)
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
        console.log ('accs')
        console.log (accs)
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

  toWei(amount){
    let _amount = amount
    _amount = amount.toString()

    console.log(_amount)
    return this.web3.utils.toWei(_amount, "ether")
  }

  toEther(amount){
    return this.web3.utils.fromWei(amount, 'ether')
  }
  toBigNumber(amount){
    return this.web3.utils.toBigNumber(amount)
  }
    
    // Listen for events emitted from the contract
  listenForEvents() {
      this.contracts.tokenSale.Sell({}, {
          fromBlock: 0,
          toBlock: 'latest',
        }).watch(function(error, event) {
          console.log("event triggered", event);
           
        })
      }
    
}
