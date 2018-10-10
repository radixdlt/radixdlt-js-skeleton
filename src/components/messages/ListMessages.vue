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
        tr(v-for="m in messages" :key="m.timestamp")
          //- td {{ m.hid }}
          td(v-if="m.is_mine") Sent
          td(v-else) Received
          td(v-if="m.is_mine") {{ m.to.getAddress() }}
          td(v-else) {{ m.from.getAddress() }}
          td {{ m.content }}
          td {{ m.timestamp }}
</template>

<script>
export default {
  name: 'Messages',
  props: ['messages']
}
</script>
