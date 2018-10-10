import Vue from 'vue'
import App from './App'

import VueTabs from 'vue-nav-tabs'
import 'vue-nav-tabs/themes/vue-tabs.css'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

import VueLocalStorage from 'vue-localstorage'

Vue.component('icon', Icon)

Vue.use(VueLocalStorage)
Vue.use(VueTabs)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
