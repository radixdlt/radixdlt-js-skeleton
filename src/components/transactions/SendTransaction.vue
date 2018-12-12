<template lang="pug">
  div
    h3 Transfer Tokens
    input.form-control(type="text", placeholder="Destination address..", v-model="destination")
    input.form-control(type="text", placeholder="Asset ISO..", v-model="asset", disabled)
    input.form-control(type="number", placeholder="Min: 0.00001", min="0.00001", step="0.00001", v-model="quantity")
    textarea.form-control(rows="4", placeholder="Optional message..", v-model="message")
    div(style="display: flex; align-items: center; justify-content: flex-end")
      button.btn.btn-outline-secondary(type="button", @click="sendTransaction()") SEND
</template>

<script>
import { RadixAccount, RadixTransactionBuilder, radixTokenManager } from '../../../../radixdlt-js'

export default {
  name: 'SendTransaction',
  props: ['identity'],
  data () {
    return {
      destination: '',
      asset: 'TEST',
      quantity: 0.00001,
      message: ''
    }
  },
  methods: {
    sendTransaction () {
      const fromAccount = this.identity.account

      // No need to load data from the ledger for the recipient account
      const toAccount = RadixAccount.fromAddress(this.destination, true)

      const tokenId = radixTokenManager.nativeToken.toString()

      const transactionStatus = RadixTransactionBuilder
        .createTransferAtom(fromAccount, toAccount, tokenId, this.quantity, this.message)
        .signAndSubmit(this.identity)

      transactionStatus.subscribe({
        next: status => {
          console.log(status)
          // For a valid transaction, this will print, 'FINDING_NODE', 'GENERATING_POW', 'SIGNING', 'STORE', 'STORED'
        },
        complete: () => { console.log('Transaction complete') },
        error: error => { console.error('Error submitting transaction', error) }
      })
    }
  }
}
</script>
