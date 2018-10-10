<template lang="pug">
  div
    h3 Application Messages
    div.input-group.mb-3
      input.form-control(type="text", placeholder="Application ID..", v-model="applicationId", @keydown.enter="getApplicationMessages()")
      button.btn.btn-outline-secondary(type="button", style="margin-left: 5px", @click="getApplicationMessages()") GET
    table.table.table-sm
      thead
        tr
          th(scope="col") Application ID
          th(scope="col") Payload
      tbody
        tr(v-for="m in messages")
          td {{ m.applicationId }}
          td {{ m.data.payload }}
</template>

<script>
export default {
  name: 'ListApplicationMessages',
  props: ['identity'],
  data () {
    return {
      applicationId: '',
      messages: []
    }
  },
  methods: {
    getApplicationMessages () {
      this.messages = []
      // Get application message updates
      this.identity.account.dataSystem.getApplicationData(this.applicationId).subscribe(applicationDataUpdate => {
        // Add application message update to messages list
        this.messages.push(applicationDataUpdate)
      })
    }
  }
}
</script>
