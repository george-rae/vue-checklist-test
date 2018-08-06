import Vue from 'vue'
import App from './App.vue'
import contenteditableDirective from 'vue-contenteditable-directive';

new Vue({
    el: '#app',
    render: h => h(App)
})

Vue.use(contenteditableDirective);
