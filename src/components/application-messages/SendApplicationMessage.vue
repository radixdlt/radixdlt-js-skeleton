<template lang="pug">
  div
    h3 Store Application Data
    input.form-control(type="text", placeholder="Application ID..", v-model="applicationId")
    input.form-control(type="text", placeholder="Destination addresses (separated by comma)..", v-model="destinations")
    textarea.form-control(rows="5", placeholder="Message..", v-model="message")
    div(style="display: flex; align-items: center; justify-content: flex-end")
      div.form-check(style="margin-right: 20px; margin-bottom: 0")
        input.form-check-input(type="checkbox", value="", id="encryptedCheck", v-model="encrypted")
        label.form-check-label(for="encryptedCheck") Encrypted
      button.btn.btn-outline-secondary(type="button", @click="sendApplicationMessage()") SEND
</template>

<script>
import {
  RadixAccount,
  RadixTransactionBuilder
} from '../../../../radixdlt-js'

export default {
  name: 'SendApplicationMessage',
  props: ['identity'],
  data () {
    return {
      applicationId: '',
      destinations: '',
      message: '',
      encrypted: true
    }
  },
  methods: {
    sendApplicationMessage () {
      const fromAccount = this.identity.account

      fromAccount.openNodeConnection()

      // Wait for the account to sync data from the ledger

      const destinations = [fromAccount]
      for (let destination of this.destinations.split(',')) {
        destinations.push(RadixAccount.fromAddress(destination))
      }

      const transactionStatus = RadixTransactionBuilder
        .createPayloadAtom(fromAccount, this.applicationId, this.message, destinations, this.encrypted)
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
