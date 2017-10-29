import Vue from 'vue';
import VueMaterial from 'vue-material';

import App from './App.vue';
import LifeGame from './lib/LifeGame';

Vue.use(VueMaterial);
Vue.material.registerTheme('black');

const app = new Vue({
	el: '#app',
	template: '<App ref="app" v-on:set_user_name="onUserNameSet" v-on:user_logout="onUserLogout"/>',
	components: {App},
	methods: {
		onUserNameSet(name) {
			this.$emit('set_user_name', name);
		},
		onUserLogout() {
			this.$emit('user_logout');
		}
	}
});

window.LifeGame = LifeGame;
window.App = {
	init() {
		app.$on('set_user_name', (token) => {
			this.onToken(token);
		});
		app.$on('user_logout', () => {
			this.onLogout();
		});
		app.$refs.app.fromLocalStorage();
	},
	onToken(token) {
		throw new Error('Вы должны имплементировать метод onToken');
	}
};
