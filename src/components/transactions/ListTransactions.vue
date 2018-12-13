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
          td {{ t.balance }} {{ t.symbol }}
          td(v-for="p in t.participants", :key="p") {{ p }}
          td {{ t.timestamp }}
          td {{ t.message }}
</template>

<script>

import {
  radixTokenManager,
} from '../../../../radixdlt-js'

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
    this.identity.account.connectionStatus.subscribe(value => {
      if (value === 'CONNECTED') {
        this.transactions = []
        // Get application message updates
        this.identity.account.transferSystem.getAllTransactions().subscribe(transferUpdate => {
          this.transactions.push({
            balance: transferUpdate.transaction.tokenUnitsBalance[radixTokenManager.nativeToken.toString()].toString().replace(/"/g, ''),
            symbol: radixTokenManager.nativeToken.symbol,
            participants: transferUpdate.transaction.participants,
            timestamp: transferUpdate.transaction.timestamp,
            message: transferUpdate.transaction.message
          })
        })
      }
    })
  }
}
</script>
