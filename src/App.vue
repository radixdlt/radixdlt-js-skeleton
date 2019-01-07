<template lang="pug">
  div#app
    img.logo(style="height: 80px; float: right", src="./assets/logo.png")
    div.site-wrapper-inner
      h1 radixdlt-js
      h4 skeleton example
      div(v-if="!remote")
        a(href="#", @click="resetSimpleIdentity()") Generate new identity
        br
        a(href="#", @click="switchToRemoteIdentity()") Switch to remote identity
      a(href="#", @click="switchToSimpleIdentity()", v-if="remote") Switch to simple identity
      p
      a(href="#", @click="unsubscribe()", v-if="!unsubscribed") Unsubscribe
      p(v-if="unsubscribed") You're unsubscribed from this account!

      div(v-if="!identity") Decrypting key
      div(v-if="identity")
        //- User's Address & Balance
        div.row
          div.col-md-12.col-lg-9.column
            Address(:address="address")
          div.col-md-12.col-lg-3.column
            Balance(:balance="balance")

        //- Tabs
        vue-tabs
          //- 1st Tab: Transactions
          v-tab(title="Transfers")
            div.row
              div.col-md-12.column
                SendTransaction(:identity="identity")
                ListTransactions(:identity="identity")

          //- 2nd Tab: Messages
          v-tab(title="Messages")
            div.row
              div.col-md-12.column
                SendMessage(:identity="identity")
                ListMessages(:identity="identity")

          //- 3rd Tab: Application Messages
          v-tab(title="Application Data")
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
  RadixRemoteIdentity,
  // RadixAddress,
  RadixKeyPair,
  RadixKeyStore,
  RadixLogger,
  RadixIdentity,
} from '../../radixdlt-js'

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
      token: null,
      identity: null,
      remote: false,
      unsubscribed: false,
    }
  },
  methods: {
    loadIdentity() {
      this.remote = this.$localStorage.get('remote')

      return new Promise(async (resolve, reject) => {
        // NOTE: This is insecure, normally you would ask the user for a password
        const password = 'SuperDuperSecure'

        if (!this.$localStorage.get('keystore')) {
          // Generate a new radom identity
          const keyPair = RadixKeyPair.generateNew()
          // const keyPair = RadixAddress.generateNew()
          RadixKeyStore.encryptKey(keyPair, password).then((encryptedKey) => {
            this.$localStorage.set('keystore', JSON.stringify(encryptedKey))
            console.log('Encrypted private key stored in localstorage')
          })
          resolve(new RadixSimpleIdentity(keyPair))
        } else {
          if (this.remote) {
            resolve(await RadixRemoteIdentity.createNew('my dApp', 'my dApp description'))
          } else {
            // Load identity from localstorage            
            const encryptedKey = JSON.parse(this.$localStorage.get('keystore'))
            RadixKeyStore.decryptKey(encryptedKey, password).then(keyPair => {
              resolve(new RadixSimpleIdentity(keyPair))
            })
          }
        }
      })
    },
    resetSimpleIdentity() {
      this.$localStorage.remove('keystore')
      location.reload()
    },
    switchToSimpleIdentity() {
      this.$localStorage.remove('remote')
      location.reload()
    },
    switchToRemoteIdentity() {
      this.$localStorage.set('remote', true)
      location.reload()
    },
    unsubscribe() {
      this.unsubscribed = true
      setTimeout(() => {
        console.log('closeNodeConnection')
        this.identity.account.closeNodeConnection()
          .then((response) => {
            console.log(`Response ${response}`)
          })
          .catch((error) => console.log(`Error ${error}`))
      }, 3000)
    }
  },
  created () {
    RadixLogger.setLevel('error')

    // Bootstrap the universe
    radixUniverse.bootstrap(RadixUniverse.ALPHANET)

    this.loadIdentity().then(identity => {
      this.identity = identity

      const account = this.identity.account

      // Load default token
      const testToken = radixTokenManager.getTokenByISO('TEST')
      // const tokenId = radixTokenManager.nativeToken.toString() // Assume single token transactions

      // Get address
      this.address = account.getAddress()

      // Get balance/s
      account.transferSystem.balanceSubject.subscribe(balance => {
        this.balance = testToken.toTokenUnits(balance[testToken.id.toString()])
      })
      // account.transferSystem.getTokenUnitsBalanceUpdates()
      //     .subscribe((balances) => {
      //         this.balance = balances[tokenId].toString()
      //     })

      account.openNodeConnection()
    })
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
