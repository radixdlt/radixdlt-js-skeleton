<template lang="pug">
  div
    h3 View Application Data
    div.input-group.mb-3
      input.form-control(type="text", placeholder="Application ID..", v-model="applicationId", @keydown.enter="getApplicationMessages()")
      button.btn.btn-outline-secondary(type="button", style="margin-left: 5px", @click="getApplicationMessages()") GET
    table.table.table-sm
      thead
        tr
          th(scope="col") HID
          th(scope="col") Payload
          th(scope="col") Timestamp
      tbody
        tr(v-for="m in messages")
          td {{ m.hid }}
          td {{ m.payload }}
          td {{ new Date(m.timestamp).toUTCString() }}
</template>

<script>
export default {
  name: 'ListApplicationMessages',
  props: ['identity'],
  data () {
    return {
      applicationId: 'radix-messaging',
      messages: []
    }
  },
  created () {
    this.getApplicationMessages()
  },
  methods: {
    getApplicationMessages () {
      this.messages = []
      // Get application message updates
      this.identity.account.dataSystem.getApplicationData(this.applicationId).subscribe(applicationDataUpdate => {
        this.messages = this.identity.account.dataSystem.applicationData.get(this.applicationId).values()
      })
    }
  }
}
</script>
