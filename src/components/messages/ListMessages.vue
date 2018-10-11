<template lang="pug">
  div
    h3 Messages
    table.table.table-sm
      thead
        tr
          //- th HID
          th Action
          th Participants
          th(style="width: 50%") Message
          th Timestamp
      tbody
        tr(v-for="m in messages")
          //- td {{ m.hid }}
          td(v-if="m.is_mine") Sent
          td(v-else) Received
          td(v-if="m.is_mine") {{ m.to.getAddress() }}
          td(v-else) {{ m.from.getAddress() }}
          td {{ m.content }}
          td {{ new Date(m.timestamp).toUTCString() }}
</template>

<script>
export default {
  name: 'Messages',
  props: ['identity'],
  data () {
    return {
      messages: []
    }
  },
  created () {
    this.messages = this.identity.account.messagingSystem.messages.values()
    // Get application message updates
    this.identity.account.messagingSystem.getAllMessages().subscribe(messageUpdate => {
      this.messages = this.identity.account.messagingSystem.messages.values()
    })
  }
}
</script>
