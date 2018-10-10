<template lang="pug">
  div
    h3 Send Message
    input.form-control(type="text", placeholder="Destination address..", v-model="destination")
    textarea.form-control(rows="4", placeholder="Message..", v-model="message")
    div(style="display: flex; align-items: center; justify-content: flex-end")
      button.btn.btn-outline-secondary(type="button", @click="sendMessage()") SEND
</template>

<script>
import { RadixAccount, RadixTransactionBuilder } from 'radixdlt'

export default {
  name: 'SendMessage',
  props: ['identity'],
  data () {
    return {
      destination: '',
      message: ''
    }
  },
  methods: {
    sendMessage () {
      const fromAccount = this.identity.account

      fromAccount.openNodeConnection()

      // Wait for the account to sync data from the ledger

      // No need to load data from the ledger for the recipient account
      const toAccount = RadixAccount.fromAddress(this.destination, true)

      const transactionStatus = RadixTransactionBuilder
        .createRadixMessageAtom(fromAccount, toAccount, this.message)
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
