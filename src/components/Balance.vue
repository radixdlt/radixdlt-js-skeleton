<template lang="pug">
  div
    h4 Balance
    span.balance {{ balance }}
</template>

<script>
export default {
  name: 'Balance',
  props: ['balance']
}
</script>

<style lang="scss" scoped>

.balance {
  font-size: 1.25rem;
  color: steelblue;
}

</style>
