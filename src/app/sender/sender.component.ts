import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';
import { modelGroupProvider } from '@angular/forms/src/directives/ng_model_group';

declare let require: any;
const CalileaToken_artifacts = require('../../../build/contracts/CalileaToken.json');

@Component({
  selector: 'app-sender',
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.css']
})
export class SenderComponent implements OnInit {
  accounts: string[];
  tokenInstance: any;

  model = {
    ether: 0,
    amount: 5,
    receiver: '',
    balance: 0,
    account: '',
    link: 'https://ropsten.etherscan.io/address/0x2912e467f43dda038be780e09238b27a330af5ea'
  };

  status = '';
  cards = [];  

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {
    console.log('Constructor: ' + web3Service);
  }

  async ngOnInit() {

    console.log(this);
    await this.watchAccount();
    await this.getInstance();
    //this.setMaxAllowed()
  }
  async getInstance() {
    try {
      console.log('getInstance....')
      this.tokenInstance = await this.web3Service.artifactsToContract(CalileaToken_artifacts)
      this.refreshBalance();
    } catch (err) {
      console.log(err)

    }
  }
  async watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      console.log(accounts)
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.setCardsValues(this.model)
    });
  }
  async setMaxAllowed(){
    let maxTokenAllowed = 1000
    const allowed = await this.tokenInstance.approve.call(this.model.account, maxTokenAllowed);

  }
  setStatus(status) {
    this.matSnackBar.open(status, null, { duration: 3000 });
  }

  async sendCoin() {
    if (!this.tokenInstance) {
      this.setStatus('CalileaToken is not loaded, unable to send transaction');
      return;
    }

    const amount = this.web3Service.formatAmount(this.model.amount);
    const receiver = this.model.receiver;

    console.log('Sending ' + amount + ' tokens to ' + receiver);

    this.setStatus('Initiating transaction... (please wait)');
    try {
    
     /*  const allowed = await this.tokenInstance.allowance.call(this.model.account, receiver);
      if (allowed > amount){
        throw 'trying to send a amount over amount allowed'
      }
      console.log('allowed: '+allowed) */

    
      const approved = await this.tokenInstance.approve.call(this.model.account, amount);
      console.log('approved : ' +approved)
      if (approved){
        let data = this.tokenInstance.transfer(
          receiver, 
          amount,
          {from: this.model.account, gas: 10000000}
        );

        let gasEstimated = await this.web3Service.estimateGas(data, this.model.account)
        console.log('GasEstimated2:'+ gasEstimated)


        const transaction = await this.tokenInstance.transfer.sendTransaction(receiver, amount);
       
        if (!transaction) {
          throw 'Transaction failed!'
        } else {
          this.setStatus('Transaction complete!');
          console.dir(transaction)
        }

      }

    } catch (e) {
     
      console.log(e);
      this.setStatus(e);
    }
  }

  async refreshBalance() {
    console.log('Refreshing balance');

    try {
      //const deployedCalileaToken = await this.tokenInstance.deployed();
      console.log(this.tokenInstance);
      console.log('Account', this.model.account);
      let etherBalance = await this.web3Service.getBalance(this.model.account);
      this.model.ether = etherBalance

      let tokenBalance = await this.tokenInstance.balanceOf.call(this.model.account)
      let decimals = await this.tokenInstance.decimals.call();
       
      let balance = Number(tokenBalance.toString()) / (10**(decimals.toString()));
      this.model.balance = balance 
      console.log('balance: ' + this.model.balance);
      this.setCardsValues(this.model)
      
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  setAmount(e) {
    console.log('Setting amount: ' + e.target.value);
    this.model.amount = e.target.value;
  }

  setReceiver(e) {
    console.log('Setting receiver: ' + e.target.value);
    this.model.receiver = e.target.value;
  }

  setCardsValues(model){
    let  cards = [  
    { title: 'Token ', cols: 1, rows: 1, value: this.model.ether, label: 'Balance Ether', currency: 'ETH', icon: 'monetization_on', link: 'https://ropsten.etherscan.io/address/0x2912e467f43dda038be780e09238b27a330af5ea'},  
    { title: 'Token ', cols: 1, rows: 1, value: this.model.balance, label: 'Tokens', currency: 'CAL', icon: 'money', link: 'https://ropsten.etherscan.io/token/0x23803d6ca1b654ca0a0ec607445ce1f50c0a7a3c' }
   ];  
    this.cards = [...cards]
  }
}
