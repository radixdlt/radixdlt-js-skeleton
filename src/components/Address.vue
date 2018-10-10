<template lang="pug">
  div
    h4 Address
    span.address {{ address }}
</template>

<script>
export default {
  name: 'Address',
  props: ['address']
}
</script>

<style lang="scss" scoped>

.address {
  font-size: 1.25rem;
  color: #c0c0c0;
}

</style>
