import { Injectable, Optional, Inject } from '@angular/core';
import contract from 'truffle-contract';
import { Subject } from 'rxjs';
import { resolve } from 'url';
import { reject } from 'q';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';
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
  private contracts = {
    calileaToken: contract,
    tokenSale: contract

  };
  // Contracts in Ropsten network  
  private calileaTokenContract = '0x384549eA7d7e5A8e221f6E6bcb89E241424cFaFC'
  private tokenSaleContract = '0xc6a1ced21b2cd67da06dbd91c67c9dff9b37e27e'

  /* Contracts in Ganache local network
    private calileaTokenContract = '0xFB4F4Db6d9Bef350d92B6Ba14080B5A68ff9b372'
    private tokenSaleContract = '0x9159A12d38A4BBB5f038d6691cfEec75D5acd1f5'
   */

  public accountsObservable = new Subject<string[]>();

  constructor( public dialog: MatDialog) {


    window.addEventListener('load', async () => {

      await this.bootstrapWeb3();

    });
    window.addEventListener('transfer', async () => {
      console.log('incoming transfer event')
    });
    window.addEventListener('TokensPurchased', async () => {
      console.log('incoming TokensPurchased event')

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
      let description = 'Non-Ethereum browser detected. You should consider trying MetaMask!'
      this.openDialog('Error web3', description, 'danger')
      console.log(description);
    }

  }

  public async getInstanceCalileaToken() {
    try {

      if (!this.web3) {
        const delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;
        return await this.getInstanceCalileaToken();
      }
      console.log('web3 connected')
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
    try {

      if (!this.web3) {
        const delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;
        return await this.getInstanceTokenSale();
      }
      console.log('web3 connected')

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
        console.log('accs')
        console.log(accs)
        this.accountsObservable.next(accs);
        this.accounts = accs;
      }


      this.ready = true;
    } catch (err) {
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

  async estimateGas(data, sender) {
    let toEstimate = {
      data: data,
      from: sender
    }
    let gasEstimated = await this.web3.eth.estimateGas(toEstimate)
    console.log('GasEstimated:' + gasEstimated)
    return gasEstimated
  }

  toWei(amount) {
    let _amount = amount
    _amount = amount.toString()

    console.log(_amount)
    return this.web3.utils.toWei(_amount, "ether")
  }

  toEther(amount) {
    return this.web3.utils.fromWei(amount, 'ether')
  }
  toBigNumber(amount) {
    return this.web3.utils.toBigNumber(amount)
  }

  // Listen for events emitted from the contract
  listenForEvents() {
    this.contracts.tokenSale.Sell({}, {
      fromBlock: 0,
      toBlock: 'latest',
    }).watch(function (error, event) {
      console.log("event triggered", event);

    })
  }
  private openDialog( title: string, description: string, type: string){
    
    let icon = (type == 'danger')? 'error': 'notification_important'
    let color = (type == 'danger')? 'warn': 'primary'
    
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: {title: title,  description: description , type: type, icon: icon, color: color }
    });
  }


}
