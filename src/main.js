import Vue from 'vue';
import VueMaterial from 'vue-material';

import App from './App.vue';
import LifeGame from './lib/LifeGame';

Vue.use(VueMaterial);
Vue.material.registerTheme('black');

const app = new Vue({
	el: '#app',
	template: '<App ref="app" v-on:set_user_name="onUserNameSet"/>',
	components: {App},
	// mounted() {
	// 	this.haveName();
	// },
	methods: {
		onUserNameSet(name) {
			this.$emit('set_user_name', name);
		}
		// ,
		// haveName() {
		// 	console.log('mounted!');
		// 	const user = this.$refs.app.userName;
		// 	if (user.length > 0) {
		//
		// 		console.log('try to emit! ' + user);
		// 		window.App.onToken(user);
		// 	};
		// }
	}
});

window.LifeGame = LifeGame;
window.App = {
	init() {
		app.$on('set_user_name', (token) => {
			console.log('in func!!!');
			this.onToken(token);
		});
		app.$refs.app.fromLocalStorage();
	},
	onToken(token) {
		throw new Error('Вы должны имплементировать метод onToken');
	}
};

window.App.init();
