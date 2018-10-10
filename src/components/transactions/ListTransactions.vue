<template lang="pug">
  div
    h3 Transactions
    table.table.table-sm(striped="true")
      thead
        tr
          th(scope="col") Quantity
          th(scope="col") Fee
          th(scope="col") Participants
          th(scope="col") Timestamp
          th(scope="col") Message
      tbody
        tr(v-for="t in transactions", :key="t.timestamp")
          td(v-for="quantity in t.balance" :key="quantity") {{ quantity }}
          td {{ t.fee }}
          td(v-for="p in t.participants", :key="p") {{ p }}
          td {{ t.timestamp }}
          td {{ t.message }}
</template>

<script>
export default {
  name: 'ListTransactions',
  props: ['transactions']
}
</script>
