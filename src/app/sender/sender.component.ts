import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { MatSnackBar } from '@angular/material';

declare let require: any;


@Component({
  selector: 'app-sender',
  templateUrl: './sender.component.html',
  styleUrls: ['./sender.component.css']
})
export class SenderComponent implements OnInit {
  accounts: string[];
  tokenInstance: any;
  tokenSaleInstance: any;
  tokensAvailable = 750000
  model = {
    ether: 0,
    amount: 5,
    receiver: '',
    balance: 0,
    account: '',
    link: ''
  };

  status = '';
  cards = [];
  tokenSale: {
    tokenPrice: 1000000000000000,
    tokenSold: Number,
    progressPercent: Number
  }
  numberOfTokens = 0;

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
      this.tokenInstance = await this.web3Service.getInstanceCalileaToken()
      if (this.tokenInstance) {
        this.refreshTokenBalance();
      }
    } catch (err) {
      console.log('Calilea Token has not been found in this account')

    }
  }
  async watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      console.log(accounts)
      this.accounts = accounts;
      this.model.account = accounts[0];
      this.model.link = `https://ropsten.etherscan.io/address/${accounts[0]}`;

      this.refreshEtherBalance(this.model.account)

    });
  }
  async setMaxAllowed() {
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

    const amount = this.web3Service.toWei(this.model.amount);
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
      console.log('approved : ' + approved)
      if (approved) {
        

        const transaction = await this.tokenInstance.transfer.sendTransaction(
          receiver, 
          amount,
          { from: this.model.account, 
            gas: 500000 
          });

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

  async refreshEtherBalance(account) {
    console.log('Refreshing ETH balance');

    try {
      console.log('Account', account);
      let etherBalance = await this.web3Service.getBalance(account);
      this.model.ether = etherBalance
      let tokenData = {
        title: 'Token ',
        cols: 1, rows: 1,
        value: etherBalance,
        label: 'Balance Ether',
        currency: 'ETH',
        icon: 'monetization_on',
        link: `https://ropsten.etherscan.io/address/${account}`
      }
      this.cards.push(tokenData)


    } catch (e) {
      console.log(e);
      this.setStatus('Error getting balance; see log.');
    }
  }

  async refreshTokenBalance() {
    console.log('Refreshing balance');

    try {

      let tokenBalance = await this.tokenInstance.balanceOf.call(this.model.account)
      let decimals = await this.tokenInstance.decimals.call();

      let balance = Number(tokenBalance.toString()) / (10 ** (decimals.toString()));
      this.model.balance = balance
      console.log('balance: ' + this.model.balance);
      let tokenData = { title: 'Token ', cols: 1, rows: 1, value: balance, label: 'Tokens', currency: 'CAL', icon: 'money', link: 'https://ropsten.etherscan.io/token/0x23803d6ca1b654ca0a0ec607445ce1f50c0a7a3c' }
      this.cards.push(tokenData)

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
  goEtherscan(url) {
    window.open(url, "_blank");
  }


}
