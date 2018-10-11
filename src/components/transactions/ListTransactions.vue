<template lang="pug">
  div
    h3 Transfers
    table.table.table-sm(striped="true")
      thead
        tr
          th(scope="col") Quantity
          th(scope="col") Participants
          th(scope="col") Timestamp
          th(scope="col") Message
      tbody
        tr(v-for="t in transactions")
          td(v-for="(quantity, tokenId) in t.balance")
            | {{ radixTokenManager.getTokenByID(tokenId).toTokenUnits(quantity) }} {{ radixTokenManager.getTokenByID(tokenId).iso }}
          td(v-for="p in t.participants", :key="p") {{ p }}
          td {{ t.timestamp }}
          td {{ t.message }}
</template>

<script>

import {
  radixTokenManager,
} from 'radixdlt'

export default {
  name: 'ListTransactions',
  props: ['identity'],
  data () {
    return {
      transactions: [],
      radixTokenManager,
    }
  },
  created () {
    this.transactions = this.identity.account.transferSystem.transactions.values()
    // Get application message updates
    this.identity.account.transferSystem.getAllTransactions().subscribe(messageUpdate => {
      this.transactions = this.identity.account.transferSystem.transactions.values()
    })
  }
}
</script>
