<template lang="pug">
  div#app
    img.logo(style="height: 80px; float: right", src="./assets/logo.png")
    div.site-wrapper-inner
      h1 radixdlt-js
      h4 skeleton example

      //- User's Address & Balance
      div.row
        div.col-md-12.col-lg-9.column
          Address(:address="address")
        div.col-md-12.col-lg-3.column
          Balance(:balance="balance")

      //- Tabs
      vue-tabs
        //- 1st Tab: Transactions
        v-tab(title="Transactions")
          div.row
            div.col-md-12.column
              SendTransaction(:identity="identity")
              ListTransactions(:transactions="transactions")

        //- 2nd Tab: Messages
        v-tab(title="Messages")
          div.row
            div.col-md-12.column
              SendMessage(:identity="identity")
              ListMessages(:messages="messages")

        //- 3rd Tab: Application Messages
        v-tab(title="Application Messages")
          div.row
            div.col-md-12.column
              SendApplicationMessage(:identity="identity")
              ListApplicationMessages(:identity="identity")
</template>

<script>
/* eslint-disable */
import Address from '@/components/Address'
import Balance from '@/components/Balance'

import SendTransaction from '@/components/transactions/SendTransaction'
import ListTransactions from '@/components/transactions/ListTransactions'

import SendMessage from '@/components/messages/SendMessage'
import ListMessages from '@/components/messages/ListMessages'

import SendApplicationMessage from '@/components/application-messages/SendApplicationMessage'
import ListApplicationMessages from '@/components/application-messages/ListApplicationMessages'

import {
  radixTokenManager,
  radixUniverse,
  RadixUniverse,
  RadixIdentityManager,
  RadixSimpleIdentity,
  RadixKeyPair
} from 'radixdlt'

export default {
  name: 'App',
  // List of imported components, to be used on this component
  components: {
    Address,
    Balance,
    SendTransaction,
    SendMessage,
    SendApplicationMessage,
    ListTransactions,
    ListMessages,
    ListApplicationMessages
  },
  data() {
    return {
      address: 'address',
      balance: 'balance',
      transactions: [],
      messages: [],
      token: null,
      identity: null
    }
  },
  created() {
    // Bootstrap the universe
    radixUniverse.bootstrap(RadixUniverse.HIGHGARDEN)
    // Initialize the token manager
    radixTokenManager.initialize()

    // NOTE: this is unsecure and only for testing purposes
    // Check if the private key is in the localStorate
    if (!this.$localStorage.get('private')) {
      // Otherwise generate a new one
      this.$localStorage.set('private', RadixKeyPair.generateNew().getPrivate())
    }
    
    const keyPair = RadixKeyPair.fromPrivate(this.$localStorage.get('private'))

    // Create identity from keyPair
    this.identity = new RadixSimpleIdentity(keyPair)

    const account = this.identity.account

    // Load default token
    const testToken = radixTokenManager.getTokenByISO('TEST')

    // Get address
    this.address = keyPair.getAddress()
    // Get balance
    account.transferSystem.balanceSubject.subscribe(balance => {
      this.balance = testToken.toTokenUnits(balance[testToken.id.toString()])
    })
    // Get transactions
    account.transferSystem.getAllTransactions().subscribe((transactionUpdate) => {
      // Get hid of the transaction update
      const hid = transactionUpdate.hid
      // Get complete transaction from the account by hid
      const transaction = account.transferSystem.transactions.get(hid)
      // Convert subUnits to token unitsy
      transaction.balance[testToken.id.toString()] = testToken.toTokenUnits(transaction.balance[testToken.id.toString()])
      // Add transaction to transactions list
      this.transactions.push(transaction)
    })
    // Get messages
    account.messagingSystem.getAllMessages().subscribe((messageUpdate) => {
      // Get hid of the message update
      const hid = messageUpdate.hid
      // Get complete message from the account by hid
      const message = account.messagingSystem.messages.get(hid)
      // Add message to messages list
      this.messages.push(message)
    })

    account.openNodeConnection()
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 30px;
}
.logo {
  height: 50px;
}

html,
body {
  height: 100%;
  padding: 0 30px;
}
body {
  color: #fff;
}

.btn:focus,
.btn-custom:focus {
  outline: 0 !important;
}
.btn-custom {
  border: none;
  font-weight: bold;
}
.btn-custom:hover,
.btn-custom:focus,
.btn-custom:active,
.btn-custom.active {
  color: #ffffff;
  background-color: #7e62ad;
  border: none;
}

.form-control::-webkit-input-placeholder {
  /* Chrome */
  color: #e6d9d9;
}
.form-control:-ms-input-placeholder {
  /* IE 10+ */
  color: #e6d9d9;
}
.form-control::-moz-placeholder {
  /* Firefox 19+ */
  color: #e6d9d9;
  opacity: 1;
}
.form-control:-moz-placeholder {
  /* Firefox 4 - 18 */
  color: #e6d9d9;
  opacity: 1;
}

.column {
  padding: 10px 15px;
}
.column input,
.column textarea,
.column .form-check {
  margin-bottom: 5px;
}

.list {
  margin-top: 10px;
}
</style>