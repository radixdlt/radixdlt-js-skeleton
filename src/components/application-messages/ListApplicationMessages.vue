<template lang="pug">
  div
    h3 View Application Data
    div.input-group.mb-3
      input.form-control(type="text", placeholder="Application ID..", v-model="applicationId", @keydown.enter="getApplicationMessages()")
      button.btn.btn-outline-secondary(type="button", style="margin-left: 5px", @click="getApplicationMessages()") GET
    input.form-control(type="text", placeholder="Signer addresses (separated by comma)..", v-model="signers")
    table.table.table-sm
      thead
        tr
          th(scope="col") HID
          th(scope="col") Payload
          th(scope="col") Timestamp
      tbody
        tr(v-for="m in messages")
          td {{ m.hid }}
          td {{ m.payload.data }}
          td {{ new Date(m.timestamp).toUTCString() }}
</template>

<script>
import { RadixAccount } from '../../../../radixdlt-js'

export default {
  name: 'ListApplicationMessages',
  props: ['identity'],
  data () {
    return {
      applicationId: 'message',
      messages: [],
      signers: '',
    }
  },
  created () {
    this.identity.account.connectionStatus.subscribe(value => {
      if (value === 'CONNECTED') {
        this.identity.account.isSynced().subscribe(value => this.getApplicationMessages())
      }
    })
  },
  methods: {
    getApplicationMessages () {
      this.messages = []
      // Extract signer addresses from input
      const signers = []
      if (this.signers !== '') {
        for (let signer of this.signers.split(',')) {
          signers.push(RadixAccount.fromAddress(signer.trim()).getAddress())
        }
      }
      // Get application message updates
      this.identity.account.dataSystem.getApplicationData(this.applicationId, signers).subscribe(applicationDataUpdate => {
        this.messages.push(applicationDataUpdate.data)
      })
    }
  }
}
</script>
